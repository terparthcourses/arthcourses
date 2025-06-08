// Express
import { Request, Response } from 'express';

// Drizzle ORM
import { db } from '@repo/database';
import { schema } from '@repo/database';
import { eq } from 'drizzle-orm';

// Better-Auth
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

class CompletionsController {
  async getCompletionsByEnrollmentId(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;

      if (!enrollmentId) {
        return res.status(400).json({ message: 'Bad Request: enrollmentId is required' });
      }

      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userId = session.user.id;

      // Query completions for this enrollmentId and user
      const completions = await db
        .select()
        .from(schema.completions)
        .where(
          eq(schema.completions.enrollmentId, enrollmentId)
        );

      return res.status(200).json(completions);
    } catch (error: any) {
      console.error('Error fetching completions:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getAllCompletionsForUser(req: Request, res: Response) {
    try {
      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userId = session.user.id;

      // Query completions for this user
      const completions = await db
        .select()
        .from(schema.completions)
        .where(eq(schema.completions.userId, userId));

      return res.status(200).json(completions);
    } catch (error: any) {
      console.error('Error fetching all completions for user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export const completionsController = new CompletionsController();