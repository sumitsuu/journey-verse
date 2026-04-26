import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { parseHomeFilters } from "@/src/helpers/parse-home-filters";
import { findSortOptions } from "@/src/lib/services/art/find-sort-options.service";
import { findGenres } from "@/src/lib/services/genre/find-genres.service";
import { findTypes } from "@/src/lib/services/type/find-types.service";
import { hasRole } from "@/src/lib/services/user/find-user-roles.service";
import { getServerSession } from "next-auth";
import { Locale } from "../../lib/i18n/locales";
import { findArts, FindArtsFiltersSchema } from "../../lib/services/art/find-arts.service";
import { HomeContextWrapper } from "./_components/home/home-context-wrapper";
import HomeView from "./_components/home/home-view";

const HomePage = async ({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ type?: string; genre?: string; year?: string; rating?: string; search?: string }>;
}>) => {
  const { locale } = await params;
  const awaitedSearchParams = await searchParams;
  const types = await findTypes({ locale });
  const genres = await findGenres(locale);
  const session = await getServerSession(authOptions);
  const isAdmin = session ? await hasRole(session.user.id, "admin") : false;

  const filters = parseHomeFilters(awaitedSearchParams, types);
  const parsedFilters = FindArtsFiltersSchema.parse(filters);

  const typeIdForSortOptions = parsedFilters.typeId || types[0]?.id || 1;
  const sortOptions = await findSortOptions({ locale, typeId: typeIdForSortOptions });

  const arts = await findArts({ locale, filters: parsedFilters });

  return (
    <HomeContextWrapper types={types} arts={arts} genres={genres} sortOptions={sortOptions} isAdmin={isAdmin}>
      <HomeView />
    </HomeContextWrapper>
  );
};

export default HomePage;
