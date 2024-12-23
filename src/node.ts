// Helpers
import crypto from 'crypto';

export * from './common';

export const generateHash = (
  value: string,
): string => crypto.createHash('sha512').update(value).digest('hex');
