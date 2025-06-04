### 🛠 Build the Docker Image

Build the Next.js application Docker image from the root of the monorepo:

```bash
docker build -f apps/app/Dockerfile -t artbrush-app .
```

* `-f apps/app/Dockerfile` specifies the Dockerfile location for the Next.js app.
* `-t artbrush-app` names the image `artbrush-app`.
* `.` sets the build context to the monorepo root (required for Turborepo and pnpm to function correctly).

### 🚀 Run the Docker Image

Start the container and expose it on port `3000`:

```bash
docker run -p 3000:3000 artbrush-app
```

You can now access the Next.js app at [http://localhost:3000](http://localhost:3000).

### 🧪 Debug the Docker Image

To troubleshoot or inspect the build process in detail, use:

```bash
docker build --no-cache --progress=plain -f apps/app/Dockerfile -t artbrush-app .
```

* `--no-cache` forces a full rebuild with no cached layers.
* `--progress=plain` provides detailed output for debugging.

### 🛠️ Environment Variables

This API relies on several environment variables to function correctly. You can define them in a `.env` file at the root of the project. Below is a description of each required variable:

**General:**

- `NEXT_PUBLIC_ENVIRONMENT`: Indicates the environment the app is running in (e.g., development, production).
- `NEXT_PUBLIC_API_URL`: The base URL of the backend API the frontend communicates with (e.g., http://localhost:8080 or a deployed API endpoint).