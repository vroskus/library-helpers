// Global Types
import type {
  Request,
  RequestHandler,
} from 'express';

// Helpers
import _ from 'lodash';
import moment from 'moment';
import aigle from 'aigle';
import sh from 'short-hash';

const asyncLodash: _.LoDashStatic = aigle.mixin(
  _,
  undefined,
);

export const getValue = <V extends null | string | void>(value: V, defaultValue: V): V => {
  let output = defaultValue;

  if (value !== null && value !== '') {
    output = value;
  }

  return output;
};

export const durationMiddleware = (): RequestHandler => (
  req: Request & { start: [number, number] },
  res,
  next,
) => {
  const start: [number, number] = process.hrtime();

  req.start = start;

  next();
};

export const getDuration = (start: [number, number] | void): number => {
  let timeInMs = 0;

  if (start) {
    const end = process.hrtime(start);

    timeInMs = (end[0] * 1000000000 + end[1]) / 1000000;
  }

  return timeInMs;
};

export const sortData = async <D extends Array<Record<string, unknown>>>(
  data: D,
  field: Array<string> | string,
  reverse?: boolean,
): Promise<D> => asyncLodash
  .chain(data)
  .sortBy(field)
  .tap(reverse ? _.reverse : _.noop)
  .value() as D;

export const getImageUrl = ({
  cdnUrl,
  image,
  size,
  undefinedImage,
}: {
  cdnUrl: string;
  image?: null | string;
  size: 'max' | 'mid' | 'min' | 'sqr';
  undefinedImage?: string;
}): string => {
  if (image) {
    return `${cdnUrl}/images/${size}/${image}`;
  }

  return `${cdnUrl}/static/${undefinedImage || 'dummy.png'}`;
};

export const getFileUrl = ({
  cdnUrl,
  file,
}: {
  cdnUrl: string;
  file: string;
}): string => `${cdnUrl}/files/${file}`;

export const makeCode = (input: string): string => sh(input).toUpperCase();

export const makeRollingCode = (value: string, lifetime: number): string => {
  let time = moment().unix();

  time -= time % lifetime;

  return makeCode(`${value}${time}`);
};

export const sleep = (milliseconds: number): Promise<void> => new Promise((resolve) => {
  setTimeout(
    resolve,
    milliseconds,
  );
});

export const isDiff = (param1: unknown, param2: unknown): boolean => _.isEqual(
  param1,
  param2,
) === false;

export const getObjectKeys: <T extends Record<string, unknown>, K extends keyof T>(
  o: T,
) => K[] = Object.keys;

export const getObjectValues: <T extends Record<string, unknown>, K extends keyof T>(
  o: T,
) => T[K][] = Object.values;

export const getObjectEntries: <T extends Record<string, unknown>, K extends keyof T>(
  o: T,
) => [K, T[K]][] = Object.entries;

export const numberValue = (input: unknown): number => (input === '' ? 0 : Number(input));
