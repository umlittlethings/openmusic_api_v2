const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator, coverValidator, storageService }) => {
    const albumsHandler = new AlbumsHandler(service, validator, coverValidator, storageService);
    server.route(routes(albumsHandler));
  },
};