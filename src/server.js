require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const ClientError = require('./exceptions/ClientError');

const exportsApi = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumService');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');
const albumLikesApi = require('./api/albums/likesIndex');
const CacheService = require('./services/postgres/CacheService');
const AlbumsValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');
const JwtTokenManager = require('./auth/JwtTokenManager');

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

const playlistSongs = require('./api/playlistSongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistSongs');

const CoverValidator = require('./validator/albums/coverIndex');
const StorageService = require('./services/storage/StorageService');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService(cacheService);
  const albumLikesService = new AlbumLikesService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const jwtTokenManager = new JwtTokenManager();
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongsService();
  const storageService = new StorageService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: { origin: ['*'] },
    },
  });

  await server.register([Jwt, Inert]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 3600,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
        coverValidator: CoverValidator,
        storageService: storageService,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: jwtTokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        playlistsService,
        playlistSongsService,
        songsService,
        validator: PlaylistSongsValidator,
      },
    },
    {
      plugin: exportsApi,
      options: {
        playlistsService,
        playlistSongsService,
        producerService: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: albumLikesApi,
      options: {
        albumLikesService,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response.output?.statusCode === 401) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message || 'Unauthorized',
        });
        newResponse.code(401);
        return newResponse;
      }

      if (response.output?.statusCode === 413) {
        const newResponse = h.response({
          status: 'fail',
          message: 'Ukuran payload melebihi batas maksimum yang diizinkan (512 KB)',
        });
        newResponse.code(413);
        return newResponse;
      }

      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode || 400);
        return newResponse;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
