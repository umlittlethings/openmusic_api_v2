const AlbumLikesHandler = require('./likesHandler');
const routes = require('./likesRoutes');

module.exports = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, { albumLikesService }) => {
    const handler = new AlbumLikesHandler(albumLikesService);
    server.route(routes(handler));
  },
};