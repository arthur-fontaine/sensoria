export type ResolverFunction<R> =
  R extends (...args: any[]) => any
  ? R
  : never
