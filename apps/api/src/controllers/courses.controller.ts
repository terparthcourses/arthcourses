// Express
import { Request, Response } from 'express';

// Drizzle ORM
import { db } from '@repo/database';
import { schema } from '@repo/database';
import { eq, and, inArray } from 'drizzle-orm';

// Better-Auth
import { auth } from '../lib/auth';
import { fromNodeHeaders } from "better-auth/node";

// Crypto
import { randomUUID } from 'crypto';

class CoursesController {
  async createCourse(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        artworkIds
      } = req.body;

      // Check if required fields are provided
      if (!title || !description) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }

      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      // Check if user is authenticated
      if (!session || !session.user) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      // Create the course in database
      const newCourse = await db.insert(schema.courses).values({
        id: randomUUID(),
        userId: session.user.id,
        title,
        description,
        artworkIds: artworkIds || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      return res.status(201).json(newCourse[0]);
    } catch (error: any) {
      console.error("Error creating course:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }

  async getCoursesByUser(req: Request, res: Response) {
    try {
      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      // Check if user is authenticated
      if (!session || !session.user) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      // Get user ID from session
      const userId = session.user.id;

      // Get all courses by user
      const courses = await db.select()
        .from(schema.courses)
        .where(eq(schema.courses.userId, userId));

      // For each course, fetch full artwork objects in the correct order
      const result = await Promise.all(courses.map(async (course: any) => {
        let artworks: any[] = [];
        if (Array.isArray(course.artworkIds) && course.artworkIds.length > 0) {
          const fetchedArtworks = await db.select()
            .from(schema.artworks)
            .where(inArray(schema.artworks.id, course.artworkIds));
          // Sort artworks to match the order of course.artworkIds
          artworks = course.artworkIds
            .map((id: string) => fetchedArtworks.find((a: any) => a.id === id))
            .filter(Boolean);
        }
        return {
          ...course,
          artworks,
        };
      }));

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error getting courses:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }

  async getCourseById(req: Request, res: Response) {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }

      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      // Check if user is authenticated
      if (!session || !session.user) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      // Get user ID from session
      const userId = session.user.id;

      // Get course by ID and user ID
      const courseArr = await db.select()
        .from(schema.courses)
        .where(
          and(
            eq(schema.courses.id, courseId),
            eq(schema.courses.userId, userId)
          )
        );

      if (!courseArr || courseArr.length === 0) {
        return res.status(404).json({
          message: 'Course not found'
        });
      }

      const course = courseArr[0];

      let artworks: any[] = [];

      if (course && Array.isArray(course.artworkIds) && course.artworkIds.length > 0) {
        const fetchedArtworks = await db.select()
          .from(schema.artworks)
          .where(inArray(schema.artworks.id, course.artworkIds));
        // Sort artworks to match the order of course.artworkIds
        artworks = course.artworkIds
          .map((id: string) => fetchedArtworks.find((a: any) => a.id === id))
          .filter(Boolean);
      }

      return res.status(200).json({ ...course, artworks });
    } catch (error: any) {
      console.error("Error getting course:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }

  async updateCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const {
        title,
        description,
        artworkIds
      } = req.body;

      if (!courseId) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }

      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      // Check if user is authenticated
      if (!session || !session.user) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      // Get user ID from session
      const userId = session.user.id;

      // Check if the course exists and belongs to the user
      const existingCourse = await db.select()
        .from(schema.courses)
        .where(
          and(
            eq(schema.courses.id, courseId),
            eq(schema.courses.userId, userId)
          )
        );

      if (!existingCourse || existingCourse.length === 0) {
        return res.status(404).json({
          message: 'Course not found or you do not have permission to update it'
        });
      }

      const course = existingCourse[0];
      if (!course) {
        return res.status(404).json({
          message: 'Course not found or you do not have permission to update it'
        });
      }

      // Prepare update object with only the fields that were provided
      const updateData: Record<string, any> = {
        updatedAt: new Date()
      };

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (artworkIds !== undefined) updateData.artworkIds = artworkIds;

      // Update the course
      const updatedCourse = await db.update(schema.courses)
        .set(updateData)
        .where(eq(schema.courses.id, courseId))
        .returning();

      return res.status(200).json(updatedCourse[0]);
    } catch (error: any) {
      console.error("Error updating course:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }

  async deleteCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        return res.status(400).json({
          message: 'Bad Request'
        });
      }

      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      // Check if user is authenticated
      if (!session || !session.user) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      // Get user ID from session
      const userId = session.user.id;

      // Check if the course exists and belongs to the user
      const course = await db.select()
        .from(schema.courses)
        .where(
          and(
            eq(schema.courses.id, courseId),
            eq(schema.courses.userId, userId)
          )
        );

      if (!course || course.length === 0) {
        return res.status(404).json({
          message: 'Not Found'
        });
      }

      // Delete the course
      await db.delete(schema.courses)
        .where(eq(schema.courses.id, courseId));

      return res.status(200).json(course);
    } catch (error: any) {
      console.error("Error deleting course:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }
}

export const coursesController = new CoursesController();