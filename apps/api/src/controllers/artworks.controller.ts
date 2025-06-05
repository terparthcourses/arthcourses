// Express
import { Request, Response } from 'express';

// Drizzle ORM
import { db } from '@repo/database';
import { schema } from '@repo/database';
import { eq, and } from 'drizzle-orm';

// Better-Auth
import { auth } from '../lib/auth';
import { fromNodeHeaders } from "better-auth/node";

// Crypto
import { randomUUID } from 'crypto';

export class ArtworksController {
  async createArtwork(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        content,
        author,
        images,
        periodTags,
        typeTags,
        collocation,
        link,
      } = req.body;

      // Check if required fields are provided
      if (!title || !description || !author || !content) {
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
          message: "Unauthorized"
        });
      }

      // Create the artwork in database
      const newArtwork = await db.insert(schema.artworks).values({
        id: randomUUID(),
        userId: session.user.id,
        title,
        author,
        description,
        content,
        images: images || [],
        periodTags: periodTags || [],
        typeTags: typeTags || [],
        collocation,
        link,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      return res.status(201).json(newArtwork[0]);
    } catch (error: any) {
      console.error("Error creating artwork:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }

  async deleteArtwork(req: Request, res: Response) {
    try {
      const { artworkId } = req.params;

      if (!artworkId) {
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

      // Check if the artwork exists and belongs to the user
      const artwork = await db.select()
        .from(schema.artworks)
        .where(
          and(
            eq(schema.artworks.id, artworkId),
            eq(schema.artworks.userId, userId)
          )
        );

      if (!artwork || artwork.length === 0) {
        return res.status(404).json({
          message: 'Not Found'
        });
      }

      // Remove artworkId from all of the user's courses' artworkIds arrays
      const userCourses = await db.select()
        .from(schema.courses)
        .where(eq(schema.courses.userId, userId));

      for (const course of userCourses) {
        if (Array.isArray(course.artworkIds) && course.artworkIds.includes(artworkId)) {
          const newArtworkIds = course.artworkIds.filter((id: string) => id !== artworkId);
          await db.update(schema.courses)
            .set({ artworkIds: newArtworkIds, updatedAt: new Date() })
            .where(eq(schema.courses.id, course.id));
        }
      }

      // Delete the artwork
      await db.delete(schema.artworks)
        .where(eq(schema.artworks.id, artworkId));

      return res.status(200).json(artwork);
    } catch (error: any) {
      console.error("Error deleting artwork:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }

  async updateArtwork(req: Request, res: Response) {
    try {
      const { artworkId } = req.params;
      const {
        title,
        description,
        author,
        images,
        periodTags,
        typeTags,
        collocation,
        link,
        content
      } = req.body;

      if (!artworkId) {
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

      // Check if the artwork exists and belongs to the user
      const existingArtwork = await db.select()
        .from(schema.artworks)
        .where(
          and(
            eq(schema.artworks.id, artworkId),
            eq(schema.artworks.userId, userId)
          )
        );

      if (!existingArtwork || existingArtwork.length === 0) {
        return res.status(404).json({
          message: 'Not Found'
        });
      }

      // Prepare update object with only the fields that were provided
      const updateData: Record<string, any> = {
        updatedAt: new Date()
      };

      updateData.title = title;
      updateData.description = description;
      updateData.author = author;
      updateData.content = content;
      updateData.images = images;
      updateData.periodTags = periodTags;
      updateData.typeTags = typeTags;
      updateData.collocation = collocation;
      updateData.link = link;

      // Update the artwork
      const updatedArtwork = await db.update(schema.artworks)
        .set(updateData)
        .where(eq(schema.artworks.id, artworkId))
        .returning();

      return res.status(200).json(updatedArtwork[0]);
    } catch (error: any) {
      console.error("Error updating artwork:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }

  async getArtworksByUser(req: Request, res: Response) {
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

      // Fetch all artworks belonging to the user
      const userArtworks = await db.select().from(schema.artworks)
        .where(eq(schema.artworks.userId, userId));

      return res.status(200).json(userArtworks);
    } catch (error: any) {
      console.error("Error fetching user artworks:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }

  async getArtworkById(req: Request, res: Response) {
    try {
      const { artworkId } = req.params;

      if (!artworkId) {
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

      // Fetch the artwork with the specified ID
      const artwork = await db.select()
        .from(schema.artworks)
        .where(eq(schema.artworks.id, artworkId));

      if (!artwork || artwork.length === 0) {
        return res.status(404).json({
          message: 'Not Found'
        });
      }

      return res.status(200).json(artwork[0]);
    } catch (error: any) {
      console.error("Error fetching artwork by ID:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }
}

export const artworksController = new ArtworksController();