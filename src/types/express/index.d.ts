import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;  // Define user as part of Request, based on JWT's payload type
    }
  }
}