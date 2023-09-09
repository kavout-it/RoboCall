declare global {
  interface Navigator {
    msSaveOrOpenBlob: (blob: Blob, fileName: string) => void;
    browserLanguage: string;
  }

  type FilterOptional<T> = Pick<
    T,
    Exclude<
      {
        [K in keyof T]: T extends Record<K, T[K]> ? K : never;
      }[keyof T],
      undefined
    >
  >;

  type FilterNotOptional<T> = Pick<
    T,
    Exclude<
      {
        [K in keyof T]: T extends Record<K, T[K]> ? never : K;
      }[keyof T],
      undefined
    >
  >;

  type PartialEither<T, K extends keyof any> = {
    [P in Exclude<keyof FilterOptional<T>, K>]-?: T[P];
  } & { [P in Exclude<keyof FilterNotOptional<T>, K>]?: T[P] } & {
    [P in Extract<keyof T, K>]?: undefined;
  };

  type Object = {
    [name: string]: any;
  };

  type EitherOr<O extends Object, L extends string, R extends string> = (
    | PartialEither<Pick<O, L | R>, L>
    | PartialEither<Pick<O, L | R>, R>
  ) &
    Omit<O, L | R>;

  // https://github.com/sindresorhus/type-fest
  type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;
  type Entries<T> = {
    [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]];
  }[keyof T][];
}

export interface Window {
}

/**
 * 弹窗
 */
export interface Dialog {
  title: string;
  visible: boolean;
}
