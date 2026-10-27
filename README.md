# XClone

Academic project: a functional clone of X (Twitter) built with a Java Spring Boot REST API and a React (Vite) single-page app, persisted in Microsoft SQL Server.

**Members:** _(write the team names here)_

## Technologies

### Backend (`Backend/`)
- Java 17
- Spring Boot 3.4.1 (Spring Web, Spring Data JPA/Hibernate, Spring Security, Validation)
- Maven
- Microsoft SQL Server via the official `mssql-jdbc` driver
- Flyway for versioned schema migrations
- JWT (jjwt) for stateless sessions
- BCrypt for password hashing

### Frontend (`frontend/ClonX/`)
- React 19 with Vite
- JavaScript (no TypeScript)
- React Router DOM
- `fetch` (centralized in `src/services/`)
- Bootstrap 5 + Bootstrap Icons

### Database
- Microsoft SQL Server (managed with SSMS)

## Requirements

- JDK 17 (Temurin recommended)
- Maven 3.9+
- Node.js 20+ and npm
- SQL Server 2019+ (Express or Developer edition) with TCP/IP enabled on port 1433

## Database setup (local)

1. Make sure the SQL Server service is running and listening on TCP **1433**
   (SQL Server Configuration Manager → SQL Server Network Configuration → Protocols → TCP/IP enabled).
2. Create the database (only if it does not exist yet):

   ```sql
   IF DB_ID('xclone') IS NULL CREATE DATABASE xclone;
   ```

   `Backend/database/create-database.sql` contains the same script.
3. Create a SQL login for the app (or reuse an existing one) and grant it access:

   ```sql
   -- in master
   CREATE LOGIN xclone WITH PASSWORD = 'a-strong-local-password', CHECK_POLICY = ON;
   -- in xclone
   CREATE USER xclone FOR LOGIN xclone;
   ALTER ROLE db_owner ADD MEMBER xclone;
   ```

## Applying migrations

Migrations run automatically when the backend starts:

- `Backend/src/main/resources/db/migration/V1__init.sql` — creates `users`, `tweets`, `follows` (PKs, FKs, unique constraints).
- `V2__indexes_and_constraints.sql` — pagination indexes and the "no self follow" rule.

Behavior:

- **Empty database**: all migrations apply in order.
- **Database that already has tables** (e.g. created earlier by Hibernate): Flyway writes a
  *baseline* at version 1 and skips `V1`; from then on only new versions apply.
- Hibernate is set to `ddl-auto=validate`: it only checks that the schema matches the entities;
  it never drops or rebuilds anything.
- Verify with `SELECT * FROM dbo.flyway_schema_history;`.

## Loading test data

The `DataSeeder` (`Backend/src/main/java/com/xclone/backend/seed/DataSeeder.java`) runs at
startup when `SEED_ENABLED=true` and is idempotent: it only seeds if the `users` table is empty
(it never duplicates or deletes data). It loads **25 users, 60 tweets and 60 follows**, designed
so several pagination pages can be tested (e.g. `laurag` has 24 followers).

## Running the backend

```powershell
cd Backend
mvn spring-boot:run
```

- API base: http://localhost:8080
- The `.env` file in `Backend/` is loaded automatically (see `.env.example`).

## Running the frontend

```powershell
cd frontend\ClonX
npm install
npm run dev
```

- App base: http://localhost:5173 (this origin must match `CORS_ALLOWED_ORIGIN` in the backend).
- Copy `.env.example` to `.env` to set `VITE_API_URL`.

## Environment variables

### Backend (`.env`, see `Backend/.env.example`)

| Variable | Purpose |
|---|---|
| `DB_URL` | SQL Server JDBC URL (host, port, database) |
| `DB_USERNAME` / `DB_PASSWORD` | Database credentials (never committed) |
| `JWT_SECRET` | Random string of at least 32 characters |
| `JWT_EXPIRATION_MS` | Token lifetime (default 24 h) |
| `CORS_ALLOWED_ORIGIN` | The only origin allowed to call the API |
| `SEED_ENABLED` | `true` loads test data into an empty database |

### Frontend (`frontend/ClonX/.env`, see `.env.example`)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:8080`) |

> `.env` files contain credentials and must never be committed (already ignored by `.gitignore`).

## Demo accounts (local test only — do not use in production)

All seeded users share the demo password **`password123`** (stored as a BCrypt hash in the
database). Examples: `laurag`, `carlosr`, `sofiam`, `juanp`, `valer`, … `sebastianr`.
Log in at `POST /api/auth/login` or through the login screen.

## REST API

All responses are JSON. Errors return `{ "message": "..." }` with no internal details.
🔒 = requires header `Authorization: Bearer <token>`.

| Method | Path | Description | Success |
|---|---|---|---|
| POST | `/api/auth/login` | Login with `username` + `password`; returns token and user | 200 |
| GET 🔒 | `/api/users/me` | Connected user with follower/following counters | 200 |
| GET 🔒 | `/api/users/{username}` | Public profile with counters and `isFollowing` | 200 |
| GET 🔒 | `/api/users/{username}/tweets?page=1&size=10` | User tweets, newest first | 200 |
| GET 🔒 | `/api/users/{username}/followers?page=1&size=10` | Followers, alphabetical by full name | 200 |
| GET 🔒 | `/api/users/{username}/following?page=1&size=10` | Following, alphabetical by full name | 200 |
| POST 🔒 | `/api/tweets` | Publish a tweet (≤ 280 chars); author comes from the token | 201 |
| GET 🔒 | `/api/feed?page=1&size=10` | Own tweets + followed users, newest first | 200 |
| POST 🔒 | `/api/follows` | Follow a user by `username` | 201 |

**There is no register endpoint by project decision** — the scope explicitly excludes user
registration; accounts come from the seed only. The only public route is `POST /api/auth/login`.

Standard pagination response (`size` accepts 1–50, default 10):

```json
{ "items": [], "page": 1, "size": 10, "totalItems": 57, "totalPages": 6 }
```

Status codes: `200` queries/login · `201` created · `400` invalid data · `401` missing/invalid
token or wrong credentials · `404` user not found · `409` already following.

## Tests

### API suite (backend)

A set of scripted HTTP checks runs against the real backend and verifies login success/failure,
401 without/with invalid token, `/me` counters, profiles, pagination validation, followers and
following lists (alphabetical), feed pagination, tweet creation and rejections (empty, > 280),
follow success/duplicate/self/unknown, and that `/api/auth/register` no longer exists.
Run it while the backend is up:

```powershell
cd Backend
node api-tests.mjs
```

### UI suite (frontend, Playwright)

19 end-to-end checks against the real Vite dev server + real API: protected routes redirect to
login, login success/failure, session persistence after reload, publish tweet + success
notification + feed refresh, own profile (no follow button, counters, pagination), followers and
following lists (10 per page, alphabetical, edge-disabled pager buttons), follow updating button
and counters without reload, invalid token forcing a new login, logout clearing the token, and
unknown-profile error state with retry. Requires backend + frontend running:

```powershell
cd frontend\ClonX
npm run e2e
```

## Current limitations

- There is no way to unfollow (not required by the scope).
- No image/media support in tweets (text only, per scope).
- The interface is Spanish-only; code, identifiers and commits are English.
- The seed password is the same for all demo accounts (fine for the local academic
  environment; never use these accounts in production).
- The JWT cannot be revoked server-side (stateless tokens until expiry).

## Troubleshooting

| Message | Cause and solution |
|---|---|
| `Could not resolve placeholder 'DB_PASSWORD'` | Missing `.env` or password. Run from the `Backend` folder. |
| `Login failed for user` | Wrong password, or SQL auth (mixed mode) not enabled. |
| `The TCP/IP connection to the host localhost, port 1433 has failed` | Enable TCP/IP on port 1433 and restart the service. |
| `Cannot open database "xclone"` | Create the database (see Database setup). |
| `Port 8080 was already in use` | Stop the other program or change `server.port`. |
