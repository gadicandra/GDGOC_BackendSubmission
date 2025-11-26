import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationError from '../exceptions/AuthenticationError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AuthenticationError('Missing authentication'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string) as any;
    (req as any).auth = {
      credentials: {
        id: decoded.userId,
      },
    };
    next();
  } catch (error) {
    return next(new AuthenticationError('Invalid token'));
  }
};
