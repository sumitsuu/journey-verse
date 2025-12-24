import Container from "@/src/components/UI/Container";
import { DEFAULT_LOCALE } from "@/src/lib/i18n/locales";
import { findArts } from "@/src/lib/services/art/find-arts/find-arts";
import { FindArtsFiltersSchema } from "@/src/lib/services/art/find-arts/schemas";
import { findSortOptions } from "@/src/lib/services/art/find-sort-options/find-sort-options";
import { findTypes } from "@/src/lib/services/type/find-types";
import ArtsView from "../_components/arts-view";
import { ArtsContextWrapper } from "./_components/arts-context-wrapper";

export default async function ArtsPage({
  params,
  searchParams,
}: {
  params: Promise<{ typeId: string }>;
  searchParams: Promise<{ genres: string[]; rating: string; yearStart: string; yearEnd: string }>;
}) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const filters = FindArtsFiltersSchema.parse({
    typeId: Number(awaitedParams.typeId),
    ...awaitedSearchParams,
  });

  const arts = await findArts({ locale: DEFAULT_LOCALE, filters });
  const sortOptions = await findSortOptions({ locale: DEFAULT_LOCALE, typeId: Number(awaitedParams.typeId) });
  const types = await findTypes();

  return (
    <Container className="!px-4">
      <ArtsContextWrapper types={types} arts={arts} sortOptions={sortOptions}>
        <ArtsView />
      </ArtsContextWrapper>
    </Container>
  );
}
