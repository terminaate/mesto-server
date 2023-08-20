export type OrFilter<T = string> = {
  $or: Record<string, T>[];
};
