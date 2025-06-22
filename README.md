# OpenMusic API

A simple RESTful API for managing music albums and songs, built with Node.js, Hapi, and PostgreSQL.

## Features

- CRUD operations for Albums and Songs
- PostgreSQL database with migrations
- Input validation with Joi
- Environment variable support with dotenv

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
   ```

4. **Create the database**

   Make sure PostgreSQL is running and create the database:

   ```bash
   createdb openmusic
   ```

5. **Run database migrations**

   ```bash
   npm run migrate
   ```

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
- `npm run migrate` — Run database migrations
- `npm run lint` — Lint the code
- `npm run lint:fix` — Lint and fix code style issues

## Project Structure

```
openmusic/
├── migrations/           # Database migration files
├── src/
│   ├── services/         # Service classes for Albums and Songs
│   └── ...               # Other source files
├── .env                  # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```
