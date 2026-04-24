export const sortOptions = ["newest", "popular", "highest", "lowest"] as const;

export type SortOption = (typeof sortOptions)[number];
