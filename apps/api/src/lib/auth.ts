// Dotenv
import dotenv from 'dotenv';
dotenv.config();

// Drizzle ORM
import { db, schema } from "@repo/database";

// Better Auth
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

// Environment variables
const environment = process.env.ENVIRONMENT;

if (environment !== "development" && !process.env.BETTER_AUTH_CROSS_SUBDOMAIN_COOKIES_DOMAIN) {
  throw new Error("BETTER_AUTH_CROSS_SUBDOMAIN_COOKIES_DOMAIN is not set in the environment variables");
}

if (environment !== "development" && !process.env.BETTER_AUTH_TRUSTED_ORIGIN_DOMAIN) {
  throw new Error("BETTER_AUTH_TRUSTED_ORIGIN_DOMAIN is not set in the environment variables");
}

export const auth =
  environment === "development" ?
    betterAuth({
      database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
          ...schema,
          user: schema.users,
        },
        usePlural: true
      }),
      emailAndPassword: {
        enabled: true,
      },
      user: {
        modelName: "users",
        additionalFields: {
          firstName: {
            type: "string",
            required: true,
          },
          lastName: {
            type: "string",
            required: true,
          },
          role: {
            type: "string",
            required: false,
            defaultValue: "STUDENT",
            input: false,
          },
          phone: {
            type: "string",
            required: false,
          },
        },
      },
    }) :
    betterAuth({
      database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
          ...schema,
          user: schema.users,
        },
        usePlural: true
      }),
      emailAndPassword: {
        enabled: true,
      },
      user: {
        modelName: "users",
        additionalFields: {
          firstName: {
            type: "string",
            required: true,
          },
          lastName: {
            type: "string",
            required: true,
          },
          role: {
            type: "string",
            required: false,
            defaultValue: "STUDENT",
            input: false,
          },
          phone: {
            type: "string",
            required: false,
          },
        },
      },
      advanced: {
        crossSubDomainCookies: {
          enabled: true,
          domain: process.env.BETTER_AUTH_CROSS_SUBDOMAIN_COOKIES_DOMAIN as string,
        },
        defaultCookieAttributes: {
          secure: true,
          httpOnly: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      trustedOrigins: [
        process.env.BETTER_AUTH_TRUSTED_ORIGIN_DOMAIN as string,
        "http://localhost:3000",
      ],
    });