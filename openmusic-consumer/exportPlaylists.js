require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');

const init = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
  const queue = 'export:playlists';

  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { playlistId, targetEmail } = JSON.parse(msg.content.toString());

      const pool = new Pool();
      const playlistQuery = {
        text: `SELECT playlists.id, playlists.name, users.username
               FROM playlists
               LEFT JOIN users ON users.id = playlists.owner
               WHERE playlists.id = $1`,
        values: [playlistId],
      };
      const playlistResult = await pool.query(playlistQuery);
      if (!playlistResult.rows.length) {
        channel.ack(msg);
        return;
      }
      const playlist = playlistResult.rows[0];

      const songsQuery = {
        text: `SELECT songs.id, songs.title, songs.performer
               FROM playlist_songs
               LEFT JOIN songs ON songs.id = playlist_songs.song_id
               WHERE playlist_songs.playlist_id = $1`,
        values: [playlistId],
      };
      const songsResult = await pool.query(songsQuery);

      const exportData = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: songsResult.rows,
        },
      };


      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"OpenMusic Export" <${process.env.SMTP_USER}>`,
        to: targetEmail,
        subject: `Ekspor Playlist: ${playlist.name}`,
        text: JSON.stringify(exportData, null, 2),
        attachments: [
          {
            filename: `playlist-${playlist.id}.json`,
            content: JSON.stringify(exportData, null, 2),
          },
        ],
      });

      channel.ack(msg);
    }
  });
};

init();