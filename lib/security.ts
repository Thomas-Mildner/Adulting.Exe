import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Enforces rate limiting per IP / client identifier.
 * @param identifier Unique key (e.g. IP or route tag)
 * @param maxRequests Maximum requests allowed within windowMs
 * @param windowMs Time window in milliseconds (default: 60s)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count };
}

/**
 * Validates request authentication and origin for administrative / sensitive endpoints.
 */
export function validateAdminRequest(request: Request | NextRequest): {
  authorized: boolean;
  errorResponse?: NextResponse;
} {
  const adminApiKey = process.env.ADMIN_API_KEY;

  // 1. If ADMIN_API_KEY is configured in env, require it via header or query
  if (adminApiKey) {
    const authHeader = request.headers.get("authorization");
    const customHeader = request.headers.get("x-admin-key");
    const url = new URL(request.url);
    const queryToken = url.searchParams.get("token");

    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    const providedKey = bearerToken || customHeader || queryToken;

    if (!providedKey || providedKey !== adminApiKey) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          { error: "Unauthorized: Invalid or missing ADMIN_API_KEY." },
          { status: 401 }
        ),
      };
    }
  }

  // 2. CSRF / Origin protection for state-changing methods (POST, PUT, DELETE)
  const method = request.method.toUpperCase();
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return {
            authorized: false,
            errorResponse: NextResponse.json(
              { error: "Forbidden: Cross-origin request rejected." },
              { status: 403 }
            ),
          };
        }
      } catch {
        return {
          authorized: false,
          errorResponse: NextResponse.json(
            { error: "Forbidden: Invalid origin." },
            { status: 403 }
          ),
        };
      }
    }
  }

  return { authorized: true };
}

