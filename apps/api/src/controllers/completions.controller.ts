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

  async markCompletionAsCompleted(req: Request, res: Response) {
    try {
      const { completionId } = req.params;

      if (!completionId) {
        return res.status(400).json({ message: 'Bad Request' });
      }

      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userId = session.user.id;

      // Check if the completion exists and belongs to the user
      const existingCompletion = await db
        .select()
        .from(schema.completions)
        .where(eq(schema.completions.id, completionId))
        .limit(1);

      if (!existingCompletion || existingCompletion.length === 0) {
        return res.status(404).json({ message: 'Not Found' });
      }

      // Check if the completion belongs to the user
      if (existingCompletion && existingCompletion[0] && existingCompletion[0].userId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // Update the completion's isCompleted field to true
      const updatedCompletion = await db
        .update(schema.completions)
        .set({ isCompleted: true })
        .where(eq(schema.completions.id, completionId))
        .returning();

      return res.status(200).json(updatedCompletion);
    } catch (error: any) {
      console.error('Error marking completion as completed:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export const completionsController = new CompletionsController();