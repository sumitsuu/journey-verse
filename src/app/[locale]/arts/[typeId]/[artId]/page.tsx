import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { Locale } from "@/src/lib/i18n/locales";
import { findArtRatingDistribution } from "@/src/lib/services/art/find-art-rating-distribution.service";
import { findArts } from "@/src/lib/services/art/find-arts.service";
import { findLibrary } from "@/src/lib/services/library/find-library.service";
import { findStatuses } from "@/src/lib/services/status/find-statuses.service";
import { getServerSession } from "next-auth";
import { DetailedView } from "./_components/detailed-view";
import { DetailedViewContextWrapper } from "./_components/detailed-view-context-wrapper";

const ArtItemPage = async ({ params }: { params: Promise<{ locale: Locale; typeId: string; artId: string }> }) => {
  const awaitedParams = await params;
  const { locale, typeId, artId } = awaitedParams;
  const artIdNum = Number(artId);
  const [art] = await findArts({ locale, filters: { typeId: Number(typeId), artId: artIdNum } });
  const session = await getServerSession(authOptions);
  const [library, libraryStatuses, ratingDistribution] = await Promise.all([
    findLibrary({ artId: artIdNum, userId: Number(session?.user?.id) }),
    findStatuses({ locale, type: "library" }),
    findArtRatingDistribution(artIdNum),
  ]);

  return (
    <DetailedViewContextWrapper
      art={art}
      library={library}
      libraryStatuses={libraryStatuses}
      ratingDistribution={ratingDistribution}
    >
      <DetailedView />
    </DetailedViewContextWrapper>
  );
};
export default ArtItemPage;
