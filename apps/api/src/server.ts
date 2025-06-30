// Dotenv
import dotenv from "dotenv";
dotenv.config();

// Express
import express, { Express, Request, Response, NextFunction } from 'express';

// CORS
import cors from 'cors';

// Pino
import pino from 'pino';
import pinoHttp from 'pino-http';

// Better-Auth
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';

// Routes
import artworksRouter from './routes/artworks.route';
import completionsRouter from './routes/completions.route';
import coursesRouter from './routes/courses.route';
import enrollmentsRouter from './routes/enrollments.route';
import imagesRouter from './routes/images.route';
import usersRouter from './routes/users.route';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

export const createServer = (): Express => {
  const app = express();

  // Environment variables
  const environment = process.env.ENVIRONMENT;

  if (!environment) {
    throw new Error("ENVIRONMENT is not set in the environment variables");
  }

  // CORS middleware
  const corsMiddleware = cors({
    origin: "https://app.arthcourses.org",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
  app.use(corsMiddleware);

  // Better-Auth middleware
  app.all("/api/auth/*splat", toNodeHandler(auth));

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use(pinoHttp({ logger }));

  // Mount routes
  app.use('/api/artworks', artworksRouter);
  app.use('/api/completions', completionsRouter);
  app.use('/api/courses', coursesRouter);
  app.use('/api/enrollments', enrollmentsRouter);
  app.use('/api/images', imagesRouter);
  app.use('/api/users', usersRouter);

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  return app;
};
