const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async likeAlbum(userId, albumId) {
    await this._verifyAlbumExists(albumId);
    const queryCheck = {
      text: 'SELECT id FROM album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(queryCheck);
    if (result.rows.length) {
      throw new InvariantError('Anda sudah menyukai album ini');
    }

    const id = `albumlike-${Date.now()}${Math.random()}`;
    const query = {
      text: 'INSERT INTO album_likes (id, user_id, album_id) VALUES ($1, $2, $3)',
      values: [id, userId, albumId],
    };
    await this._pool.query(query);
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async unlikeAlbum(userId, albumId) {
    await this._verifyAlbumExists(albumId);
    const query = {
      text: 'DELETE FROM album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Anda belum menyukai album ini');
    }
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      return { likes: parseInt(result, 10), fromCache: true };
    } catch {

      await this._verifyAlbumExists(albumId);
      const query = {
        text: 'SELECT COUNT(*) FROM album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].count, 10);
      await this._cacheService.set(`album-likes:${albumId}`, likes, 1800);
      return { likes, fromCache: false };
    }
  }

  async _verifyAlbumExists(albumId) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Album tidak ditemukan');
  }
}

module.exports = AlbumLikesService;