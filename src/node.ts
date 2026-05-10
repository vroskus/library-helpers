// Global Types
import type {
  NextFunction as $Next,
  Request as $Request,
  Response as $Response,
} from 'express';

// Helpers
import crypto from 'crypto';

export * from './common';

export const durationMiddleware = <REQ extends $Request>() => (
  req: REQ,
  res: $Response,
  next: $Next,
) => {
  Object.defineProperty(
    req,
    'start',
    {
      value: process.hrtime(),
      writable: false,
    },
  );

  next();
};

export const generateHash = (
  value: string,
): string => crypto.createHash('sha512').update(value).digest('hex');
