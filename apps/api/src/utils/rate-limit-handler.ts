// Better-Auth
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  limit: number;
  resetInterval: number; // in milliseconds
}

// Default rate limit configuration
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  limit: 100,
  resetInterval: 60 * 1000, // 1 minute
};

// Specific rate limit for R2 endpoints
const R2_RATE_LIMIT: RateLimitConfig = {
  limit: 10,
  resetInterval: 60 * 1000, // 1 minute
};

// Map to store rate limits for different users and endpoints
const rateLimits = new Map<string, Map<string, RateLimitInfo>>();

export async function checkRateLimit(
  headers: Record<string, string | string[] | undefined>,
  isR2Endpoint: boolean = false
): Promise<boolean> {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });

    // If no session, return false
    if (!session || !session.user) {
      return false;
    }

    const userId = session.user.id;
    const now = Date.now();
    const config = isR2Endpoint ? R2_RATE_LIMIT : DEFAULT_RATE_LIMIT;
    const endpointType = isR2Endpoint ? 'r2' : 'default';

    // Initialize user's rate limits if not exists
    if (!rateLimits.has(userId)) {
      rateLimits.set(userId, new Map());
    }

    const userRateLimits = rateLimits.get(userId)!;
    let rateLimitInfo = userRateLimits.get(endpointType);

    if (!rateLimitInfo) {
      rateLimitInfo = {
        count: 0,
        resetTime: now + config.resetInterval,
      };
      userRateLimits.set(endpointType, rateLimitInfo);
    }

    // Check if we need to reset the counter
    if (now >= rateLimitInfo.resetTime) {
      rateLimitInfo.count = 0;
      rateLimitInfo.resetTime = now + config.resetInterval;
    }

    // Check if user has exceeded the rate limit
    if (rateLimitInfo.count >= config.limit) {
      return false;
    }

    // Increment the counter
    rateLimitInfo.count++;
    return true;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return false;
  }
}

export function getRemainingCalls(
  headers: Record<string, string | string[] | undefined>,
  isR2Endpoint: boolean = false
): Promise<number> {
  return new Promise(async (resolve) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(headers),
      });

      if (!session || !session.user) {
        resolve(0);
        return;
      }

      const userId = session.user.id;
      const config = isR2Endpoint ? R2_RATE_LIMIT : DEFAULT_RATE_LIMIT;
      const endpointType = isR2Endpoint ? 'r2' : 'default';

      const userRateLimits = rateLimits.get(userId);
      if (!userRateLimits) {
        resolve(config.limit);
        return;
      }

      const rateLimitInfo = userRateLimits.get(endpointType);
      if (!rateLimitInfo) {
        resolve(config.limit);
        return;
      }

      const now = Date.now();
      if (now >= rateLimitInfo.resetTime) {
        resolve(config.limit);
        return;
      }

      resolve(Math.max(0, config.limit - rateLimitInfo.count));
    } catch (error) {
      console.error('Error getting remaining calls:', error);
      resolve(0);
    }
  });
} 