const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() { this._pool = new Pool(); }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('Playlist gagal ditambahkan');
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             LEFT JOIN users ON users.id = playlists.owner
             WHERE playlists.owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = { text: 'SELECT * FROM playlists WHERE id = $1', values: [id] };
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Playlist tidak ditemukan');
    if (result.rows[0].owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }

  async deletePlaylist(id) {
    const query = {
        text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
        values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
}

module.exports = PlaylistsService;