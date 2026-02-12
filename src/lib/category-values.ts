export const CATEGORY_VALUES = [
  "programming",
  "design",
  "business",
  "science",
  "language",
  "music",
  "health",
  "writing",
  "personal",
  "other",
] as const;

export type Category = (typeof CATEGORY_VALUES)[number];
