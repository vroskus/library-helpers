// Helpers
import crypto from 'crypto';

export * from './common';

export const generateHash = (
  value: string,
): string => crypto.createHash('md5').update(value).digest('hex');
