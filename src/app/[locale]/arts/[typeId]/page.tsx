import Container from "@/src/components/UI/Container";
import { Locale } from "@/src/lib/i18n/locales";
import { findArts, FindArtsFiltersSchema } from "@/src/lib/services/art/find-arts.service";
import { findSortOptions } from "@/src/lib/services/art/find-sort-options.service";
import { findTypes } from "@/src/lib/services/type/find-types.service";
import ArtsView from "../_components/arts-view";
import { ArtsContextWrapper } from "./_components/arts-context-wrapper";

export default async function ArtsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; typeId: string }>;
  searchParams: Promise<{ genres: string[]; rating: string; yearStart: string; yearEnd: string }>;
}) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const { locale, typeId } = awaitedParams;

  const filters = FindArtsFiltersSchema.parse({
    typeId: Number(typeId),
    ...awaitedSearchParams,
  });

  const arts = await findArts({ locale, filters });
  const sortOptions = await findSortOptions({ locale, typeId: Number(typeId) });
  const types = await findTypes({ locale });

  return (
    <Container className="!px-4">
      <ArtsContextWrapper types={types} arts={arts} sortOptions={sortOptions}>
        <ArtsView />
      </ArtsContextWrapper>
    </Container>
  );
}
