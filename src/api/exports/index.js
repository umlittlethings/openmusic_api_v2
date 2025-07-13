const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistSongsService, producerService, validator }) => {
    const handler = new ExportsHandler(playlistsService, playlistSongsService, producerService, validator);
    server.route(routes(handler));
  },
};