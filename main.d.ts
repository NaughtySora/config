type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null;

type DeepRequired<T> =
  T extends Primitive
  ? Exclude<T, undefined>
  : T extends Buffer
  ? Buffer
  : T extends any[]
  ? T
  : {
    [K in keyof T]-?:
    DeepRequired<Exclude<T[K], undefined>>;
  };

type Merge<T, S> = {
  [K in keyof T | keyof S]:
  K extends keyof S
  ? K extends keyof T
  ? T[K] extends object
  ? S[K] extends object
  ? Merge<T[K], S[K]>
  : S[K]
  : S[K]
  : S[K]
  : K extends keyof T
  ? T[K]
  : never;
};

export declare function register<T extends object>
  (data: T): Readonly<DeepRequired<T>>;

export declare function copy<T extends object, S extends object>
  (target: T, source: S): Readonly<DeepRequired<Merge<T, S>>>;

export declare function load(prefix: string): Record<string, any>;