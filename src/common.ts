// Global Types
import type {
  NextFunction as $Next,
  Request as $Request,
  Response as $Response,
} from 'express';

// Helpers
import _ from 'lodash';
import aigle from 'aigle';
import sh from 'short-hash';

const asyncLodash: _.LoDashStatic = aigle.mixin(
  _,
  undefined,
);

export const getValue = <V extends string | null | void>(value: V, defaultValue: V): V => {
  let output = defaultValue;

  if (value !== null && value !== '') {
    output = value;
  }

  return output;
};

export const durationMiddleware = <REQ extends ($Request & {
  start?: [number, number];
}), RES extends $Response>() => (
    req: REQ & {
      start?: [number, number];
    },
    res: RES,
    next: $Next,
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
  field: string | Array<string>,
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
  image?: string | null;
  size: 'min' | 'mid' | 'max' | 'sqr';
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
