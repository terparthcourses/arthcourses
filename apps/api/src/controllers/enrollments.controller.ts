// Express
import { Request, Response } from 'express';

// Drizzle ORM
import { db } from '@repo/database';
import { schema } from '@repo/database';

// Better-Auth
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

// Crypto
import { randomUUID } from 'crypto';

// Drizzle ORM comparison
import { eq } from 'drizzle-orm';

class EnrollmentsController {
  async createEnrollment(req: Request, res: Response) {
    try {
      const { courseId } = req.body;

      if (!courseId) {
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

      // Create the enrollment
      const newEnrollment = await db.insert(schema.enrollments).values({
        id: randomUUID(),
        userId,
        courseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      // Get number of artworks in course
      const [course] = await db
        .select()
        .from(schema.courses)
        .where(eq(schema.courses.id, courseId));

      if (!newEnrollment[0]) {
        return res.status(400).json({ message: 'Bad Request' });
      }

      // Create completions for each artwork in course
      if (course) {
        if (course.artworkIds) {
          for (const artworkId of course.artworkIds) {
            await db.insert(schema.completions).values({
              id: randomUUID(),
              userId,
              artworkId,
              enrollmentId: newEnrollment[0].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
      }

      return res.status(201).json(newEnrollment[0]);
    } catch (error: any) {
      console.error('Error creating enrollment:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getEnrollmentsByUser(req: Request, res: Response) {
    try {
      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userId = session.user.id;

      // Get enrollments for this user
      const enrollments = await db
        .select()
        .from(schema.enrollments)
        .where(eq(schema.enrollments.userId, userId));

      return res.status(200).json(enrollments);
    } catch (error: any) {
      console.error('Error fetching enrollments:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export const enrollmentsController = new EnrollmentsController();