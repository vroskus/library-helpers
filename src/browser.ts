// Helpers
import * as React from 'react';
import _ from 'lodash';
import qs from 'query-string';
import {
  fadeIn,
  fadeInDown,
  fadeInUp,
} from 'react-animations';
import {
  css,
  StyleSheet,
} from 'aphrodite';

export * from './common';

const zeroValue: number = 0;

const isEmptyString = (value: unknown): boolean => {
  if (typeof value === 'string' && value.trim().length === zeroValue) {
    return true;
  }

  return false;
};

const isObject = (input: unknown): boolean => input !== null
  && typeof input === 'object'
  && input?.constructor === Object;

export const cleanFormValues = <D extends Record<string, unknown>>(
  data: Record<string, unknown>,
): D => {
  const withoutHiddenItemsData = _.omitBy(
    data,
    (value, key: string) => _.startsWith(
      key,
      '_',
    ),
  );

  return _.mapValues(
    withoutHiddenItemsData,
    (value) => {
      if (Array.isArray(value) === true) {
        return value.map((valueValue) => {
          if (isObject(valueValue) === true) {
            return cleanFormValues(valueValue);
          }

          return isEmptyString(valueValue) === true ? null : valueValue;
        });
      }

      return isEmptyString(value) === true ? null : value;
    },
  ) as D;
};

type $AnimationName = 'fadeIn' | 'fadeInDown' | 'fadeInUp';

export const animationClass = (name: $AnimationName): string => {
  const animations = {
    fadeIn,
    fadeInDown,
    fadeInUp,
  };

  const style = StyleSheet.create({
    animation: {
      animationDuration: '1s',
      animationName: animations[name],
    },
  });

  return css(style.animation);
};

export const getUrlGetParams = (input: string): Record<string, null | string> => {
  const parsedData = qs.parse(input);

  const output = {
  };

  _.forEach(
    parsedData,
    (value: Array<null | string> | null | string, key: string) => {
      if (Array.isArray(value)) {
        output[key] = value.join(';');
      } else {
        output[key] = value;
      }
    },
  );

  return output;
};

const getScrollTopValue = (elementId?: string, offset?: number): number => {
  const defaultOffset = 15;
  let value = zeroValue;

  if (document && elementId) {
    const element = document.getElementById(elementId);

    if (element) {
      value = element.offsetTop - (offset || defaultOffset);
    }
  }

  return value;
};

export const scrollTop = (elementId?: string, offset?: number): void => {
  if (window && window.scrollTo) {
    window.scrollTo({
      behavior: 'smooth',
      top: getScrollTopValue(
        elementId,
        offset,
      ),
    });
  }
};

export const scrollItem = (itemId: string, elementId: string, offset?: number): void => {
  if (document) {
    const defaultOffset = -50;
    const item = document.getElementById(itemId);
    const element = document.getElementById(elementId);

    if (item && element) {
      item.scroll({
        behavior: 'smooth',
        top: element.offsetTop + (offset || defaultOffset),
      });
    }
  }
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = React.useRef<T>(undefined);

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
