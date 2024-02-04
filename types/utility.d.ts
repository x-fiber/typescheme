export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'TRACE' | 'OPTIONS';

export type UnknownObject = Record<string, unknown>;
export type AnyFn = ((...args: any[]) => Promise<void>) | ((...args: any[]) => void);
export type FnObject = Record<string, AnyFn>;

export type KeyStringLiteralBuilder<T> = T extends UnknownObject
  ? {
      [K in keyof T]: T[K] extends UnknownObject
        ? `${string & K}:${KeyStringLiteralBuilder<T[K]>}`
        : `${string & K}`;
    }[keyof T]
  : string;
