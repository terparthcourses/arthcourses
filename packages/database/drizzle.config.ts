// Drizzle ORM
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/_out",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});