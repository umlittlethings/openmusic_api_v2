# OpenMusic API

A simple RESTful API for managing music albums, songs, users, authentication, and playlists, built with Node.js, Hapi, and PostgreSQL.

## Features

- CRUD operations for Albums and Songs
- User registration and authentication (JWT)
- Playlist management (add, view, delete playlists and songs in playlists)
- PostgreSQL database with migrations and foreign key constraints
- Input validation with Joi
- Environment variable support with dotenv
- Error handling for validation, authentication, authorization, and server errors

## Requirements

- Node.js (v16+ recommended)
- PostgreSQL

## Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd openmusic
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```
   HOST=localhost
   PORT=5000

   PGUSER=postgres
   PGPASSWORD=yourpassword
   PGDATABASE=openmusic
   PGHOST=localhost
   PGPORT=5432

   ACCESS_TOKEN_KEY=youraccesstokensecret
   REFRESH_TOKEN_KEY=yourrefreshtokensecret
   ```

4. **Create the database**

   Make sure PostgreSQL is running and create the database:

   ```bash
   createdb openmusic
   ```

5. **Run database migrations**

   ```bash
   npm run migrate up
   ```

   > To rollback migrations, use:  
   > `npm run migrate down`

6. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run start:dev
   ```

## Scripts

- `npm start` — Start the server
- `npm run start:dev` — Start the server with nodemon
- `npm run migrate up` — Run all database migrations
- `npm run migrate down` — Rollback the last migration
- `npm run lint` — Lint the code
- `npm run lint:fix` — Lint and fix code style issues

## Project Structure

```
openmusic/
├── migrations/           # Database migration files
├── src/
│   ├── api/              # API route handlers (albums, songs, users, authentications, playlists, playlistSongs)
│   ├── services/         # Service classes for database access
│   ├── validator/        # Joi validation schemas and validators
│   ├── exceptions/       # Custom error classes
│   ├── auth/             # JWT token manager
│   └── server.js         # Main server entry point
├── .env                  # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

## API Overview

- **Albums**: CRUD `/albums`
- **Songs**: CRUD `/songs`
- **Users**: Register `/users`
- **Authentications**: Login, refresh, logout `/authentications`
- **Playlists**: Manage playlists `/playlists`
- **Playlist Songs**: Manage songs in playlists `/playlists/{playlistId}/songs`

See the Postman collection in `/test` for example requests and responses.

---
