import { parseHomeFilters } from "@/src/helpers/parse-home-filters";
import { findSortOptions } from "@/src/lib/services/art/find-sort-options.service";
import { findGenres } from "@/src/lib/services/genre/find-genres.service";
import { findTypes } from "@/src/lib/services/type/find-types.service";
import { Locale } from "../../lib/i18n/locales";
import { findArts, FindArtsFiltersSchema } from "../../lib/services/art/find-arts.service";
import { HomeContextWrapper } from "./_components/home/home-context-wrapper";
import HomeView from "./_components/home/home-view";

async function HomePage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ type?: string; genre?: string; year?: string; rating?: string; search?: string }>;
}>) {
  const { locale } = await params;
  const awaitedSearchParams = await searchParams;
  const types = await findTypes({ locale });
  const genres = await findGenres(locale);

  const filters = parseHomeFilters(awaitedSearchParams, types);
  const parsedFilters = FindArtsFiltersSchema.parse(filters);

  const typeIdForSortOptions = parsedFilters.typeId || types[0]?.id || 1;
  const sortOptions = await findSortOptions({ locale, typeId: typeIdForSortOptions });

  const arts = await findArts({ locale, filters: parsedFilters });

  return (
    <HomeContextWrapper types={types} arts={arts} genres={genres} sortOptions={sortOptions}>
      <HomeView searchQuery={awaitedSearchParams.search || ""} />
    </HomeContextWrapper>
  );
}

export default HomePage;
