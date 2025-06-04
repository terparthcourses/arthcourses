### 🛠 Build the Docker Image

Build the API Docker image from the root of the monorepo:

```bash
docker build -f apps/api/Dockerfile -t artbrush-api .
```

* `-f apps/api/Dockerfile` specifies the Dockerfile location.
* `-t artbrush-api` names the image `artbrush-api`.
* `.` sets the build context to the monorepo root (required for Turborepo and pnpm to function correctly).

### 🚀 Run the Docker Image

Start the container and expose it on port `8080`:

```bash
docker run -p 8080:8080 artbrush-api
```

You can now access the API at [http://localhost:8080](http://localhost:8080).

### 🧪 Debug the Docker Image

If you need to troubleshoot or inspect the build process, use:

```bash
docker build --no-cache --progress=plain -f apps/api/Dockerfile -t artbrush-api .
```

* `--no-cache` forces a fresh build (no layer reuse).
* `--progress=plain` enables full logging output for debugging.

### 🛠️ Environment Variables

This API relies on several environment variables to function correctly. You can define them in a `.env` file at the root of the project. Below is a description of each required variable:

**General:** 

- `PORT`: The port number the server will listen on (default is 8080).
- `ENVIRONMENT`: Defines the environment mode (e.g., development, production).

**Supabase:**

- `DATABASE_PASSWORD`: The password for the Supabase Postgres user.
- `DATABASE_URL`: Full connection string to the Supabase Postgres database.

**Better-Auth:**

- `BETTER_AUTH_SECRET`: Secret key used to authenticate with the Better-Auth service.
- `BETTER_AUTH_URL`: Base URL of the Better-Auth service (e.g., http://localhost:3000).
- `BETTER_AUTH_CROSS_SUBDOMAIN_COOKIES_DOMAIN`: Domain used for cross-subdomain cookie support (e.g., .spanhornet.com).
- `BETTER_AUTH_TRUSTED_ORIGIN_DOMAIN`: Trusted origin domain for frontend access (e.g., https://artbrush-app.spanhornet.com).

⚠️ Never commit your .env file or sensitive credentials to version control. Use .gitignore to exclude it.