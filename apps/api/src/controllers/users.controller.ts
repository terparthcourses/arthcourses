// Express
import { Request, Response } from 'express';

// Better-Auth
import { auth } from '../lib/auth';
import { fromNodeHeaders } from "better-auth/node";

export class UsersController {
  async getUser(req: Request, res: Response) {
    try {
      // Use Better-Auth to get the session
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session || !session.user) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      return res.status(200).json(session.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const {
        email,
        password
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Fields `email` and `password` are required'
        });
      }

      // Use Better-Auth to sign in
      const response = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        headers: fromNodeHeaders(req.headers),
        asResponse: true
      });

      // Extract headers, status, and body from the response
      const headers = Object.fromEntries(response.headers.entries());
      const status = response.status;
      const body = await response.json().catch(() => ({}));

      // Set any cookies or headers from the response
      Object.entries(headers).forEach(([key, value]) => {
        if (key.toLowerCase() === "set-cookie" && value) {
          res.setHeader("Set-Cookie", value);
        }
      });

      // Forward the response status and body to our Express response
      res.status(status).json(body);
    } catch (error) {
      console.error('Error signing in:', error);
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  async signUp(req: Request, res: Response) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Fields `email` and `password` are required'
        });
      }

      // Use Better-Auth to sign up
      const response = await auth.api.signUpEmail({
        body: {
          name: `${firstName} ${lastName}`,
          firstName,
          lastName,
          email,
          phone,
          password,
        },
        headers: fromNodeHeaders(req.headers),
        asResponse: true
      });

      // Extract headers, status, and body from the response
      const headers = Object.fromEntries(response.headers.entries());
      const status = response.status;
      const body = await response.json().catch(() => ({}));

      // Set any cookies or headers from the response
      Object.entries(headers).forEach(([key, value]) => {
        if (key.toLowerCase() === "set-cookie" && value) {
          res.setHeader("Set-Cookie", value);
        }
      });

      res.status(status).json(body);
    } catch (error) {
      console.error('Error signing up:', error);
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  async signOut(req: Request, res: Response) {
    try {
      // Use Better-Auth to sign out
      const response = await auth.api.signOut({
        asResponse: true,
        headers: fromNodeHeaders(req.headers)
      });

      // Extract headers, status, and body from the response
      const headers = Object.fromEntries(response.headers.entries());
      const status = response.status;
      const body = await response.json().catch(() => ({}));

      // Set any cookies or headers from the response
      Object.entries(headers).forEach(([key, value]) => {
        if (key.toLowerCase() === "set-cookie" && value) {
          res.setHeader("Set-Cookie", value);
        }
      });

      res.status(status).json(body);
    } catch (error) {
      console.error('Error signing out:', error);
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
}

export const usersController = new UsersController();