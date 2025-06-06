// Express
import { Request, Response } from 'express';

// Drizzle ORM
import { db } from '@repo/database';
import { schema } from '@repo/database';

// Better-Auth
import { auth } from '../lib/auth';
import { fromNodeHeaders } from "better-auth/node";

// Drizzle ORM
import { eq } from 'drizzle-orm';

// Multer
import multer from 'multer';

// Utilities
import { randomUUID } from 'crypto';

// R2 Service
import { uploadImageToR2, deleteImageFromR2 } from '../services/r2.service';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export class ImagesController {
  async uploadImage(req: Request, res: Response) {
    upload.single('image')(req, res, async (err) => {
      try {
        // Check if there is an error
        if (err) {
          return res.status(400).json({
            message: 'Bad Request'
          });
        }

        // Check if there is a file
        if (!req.file) {
          return res.status(400).json({
            message: 'Bad Request'
          });
        }

        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });

        // Check if user is authenticated
        if (!session || !session.user) {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }

        // Upload the image
        const imageUrl = await uploadImageToR2(
          req.file.buffer,
          req.file.mimetype,
          req.headers
        );

        // Save image record to database
        const imageId = randomUUID();
        await db.insert(schema.images).values({
          id: imageId,
          userId: session.user.id,
          url: imageUrl,
          size: req.file.size,
          mimeType: req.file.mimetype as any,
          name: req.file.originalname,
        });

        return res.status(201).json({
          imageUrl,
          imageId
        });
      } catch (error: any) {
        console.error("Error uploading image:", error);
        return res.status(500).json({
          message: 'Internal Server Error'
        });
      }
    });
  }

  async deleteImage(req: Request, res: Response) {
    try {
      const { imageUrl } = req.body;

      // Check if imageUrl is provided
      if (!imageUrl) {
        return res.status(400).json({
          message: "Bad Request",
        });
      }

      // Get the authenticated user session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      // Check if user is authenticated
      if (!session || !session.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      // Find the image in the database
      const [imageRecord] = await db
        .select()
        .from(schema.images)
        .where(eq(schema.images.url, imageUrl))
        .limit(1);

      if (!imageRecord) {
        return res.status(404).json({
          message: "Image not found",
        });
      }

      // Check if the user owns this image
      if (imageRecord.userId !== session.user.id) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      // Delete the image from R2
      await deleteImageFromR2(imageUrl, req.headers);

      // Delete the image record from database
      await db
        .delete(schema.images)
        .where(eq(schema.images.url, imageUrl));

      return res.status(200).json({
        message: "Image deleted successfully"
      });
    } catch (error: any) {
      console.error("Error deleting image:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }

  async getImageByUrl(req: Request, res: Response) {
    try {
      const { url } = req.params;

      // Check if `imageUrl` is provided
      if (!url) {
        return res.status(400).json({
          message: "Bad Request"
        });
      }

      // Find the image in the database
      const [imageRecord] = await db
        .select()
        .from(schema.images)
        .where(eq(schema.images.url, url))
        .limit(1);

      if (!imageRecord) {
        return res.status(404).json({
          message: "Not Found"
        });
      }

      return res.status(200).json(imageRecord);
    } catch (error: any) {
      console.error("Error getting image:", error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  }
}

export const imagesController = new ImagesController();