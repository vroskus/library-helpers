// Helpers
import crypto from 'crypto';

export * from './common';

type $GenerateHash = (value: string) => string;

export const generateHash: $GenerateHash = (v) => crypto.createHash('md5').update(v).digest('hex');
