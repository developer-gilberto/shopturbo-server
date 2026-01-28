import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import type { Response } from "express";
import type { ExtendedRequest } from "../../domains/user/interfaces/userInterfaces";

export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos em milisegundos
  limit: (req: ExtendedRequest) => (req.loggedUser?.email ? 50 : 10),
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req: ExtendedRequest) => {
    if (req.loggedUser?.email) return `request-attempt:${req.loggedUser.email}`;

    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
    const clientIp = Array.isArray(ip) ? ip[0] : ip;
    const normalizedIp = ipKeyGenerator(clientIp);

    return `request-attempt:${normalizedIp}`;
  },

  handler: (req: ExtendedRequest, res: Response) => {
    res.status(429).json({
      error: true,
      code: "TOO_MANY_REQUESTS",
      message: req.loggedUser?.email
        ? "Authenticated users can only make 50 requests every 10 minutes. Too many requests, please try again later."
        : "Unauthenticated users can only make 10 requests every 10 minutes. Too many requests, please try again later.",
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutos em milisegundos
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const email = String(req.body?.email || "unknown-email")
      .toLowerCase()
      .trim();

    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
    const clientIp = Array.isArray(ip) ? ip[0] : ip;
    const normalizedIp = ipKeyGenerator(clientIp);

    return `login-attempt:${normalizedIp}:${email}`;
  },

  handler: (_req, res) => {
    res.status(429).json({
      error: true,
      code: "AUTH_BRUTE_FORCE_PROTECTION",
      message:
        "Too many login attempts. For security reasons, please try again in 30 minutes.",
    });
  },
});
