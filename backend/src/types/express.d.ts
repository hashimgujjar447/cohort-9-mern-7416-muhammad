import type { IJwtPayload } from "../modules/auth/auth.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export {};
