const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() { this._pool = new Pool(); }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('User gagal ditambahkan');
    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = { text: 'SELECT username FROM users WHERE username = $1', values: [username] };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) throw new InvariantError('Username sudah digunakan');
  }

  async getUserByUsername(username) {
    const query = { text: 'SELECT * FROM users WHERE username = $1', values: [username] };
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('User tidak ditemukan');
    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    let user;
    try {
        user = await this.getUserByUsername(username);
    } catch (error) {
        throw new AuthenticationError('Kredensial salah');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AuthenticationError('Kredensial salah');
    return user.id;
  }
}

module.exports = UsersService;