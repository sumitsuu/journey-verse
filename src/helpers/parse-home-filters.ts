import type { FindArtsFilters } from "@/src/lib/services/art/find-arts.service";
import type { FindTypesOutput } from "@/src/lib/services/type/find-types.service";

type HomeSearchParams = {
  type?: string;
  genre?: string;
  year?: string;
  rating?: string;
  search?: string;
};

export function parseHomeFilters(searchParams: HomeSearchParams, types: FindTypesOutput[]): FindArtsFilters {
  const filters: Partial<FindArtsFilters> = {};

  if (searchParams.type && searchParams.type !== "all") {
    const type = types.find((t) => t.catalogName?.toLowerCase() === searchParams.type?.toLowerCase());
    if (type) {
      filters.typeId = type.id;
    }
  }

  if (searchParams.genre) {
    const genreId = Number(searchParams.genre);
    if (!isNaN(genreId)) {
      filters.genres = [genreId.toString()];
    }
  }

  if (searchParams.rating) {
    filters.rating = searchParams.rating;
  }

  if (searchParams.year && searchParams.year !== "all") {
    const year = Number(searchParams.year);
    filters.yearStart = year.toString();
    filters.yearEnd = year.toString();
  }

  return filters;
}
