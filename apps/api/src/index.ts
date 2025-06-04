// Dotenv
import dotenv from "dotenv";
dotenv.config();

// Server
import { createServer, logger } from './server';

// Environment variables
const environment = process.env.ENVIRONMENT;
const port = process.env.PORT;

if (!environment) {
  throw new Error("ENVIRONMENT is not set in the environment variables");
}

if (!port) {
  throw new Error("PORT is not set in the environment variables");
}

// Create server
const app = createServer();

app.listen(port, () => {
  logger.info(`🚀 Server is running at ${port} in ${environment} mode`);
});
