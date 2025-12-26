import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { Locale } from "@/src/lib/i18n/locales";
import { findArts } from "@/src/lib/services/art/find-arts/find-arts.service";
import { checkIsInLibrary } from "@/src/lib/services/library/check-is-in-library/check-is-in-library.service";
import { findStatuses } from "@/src/lib/services/status/find-statuses.service";
import { getServerSession } from "next-auth";
import DetailedView from "./_components/detailed-view";
import { DetailedViewContextWrapper } from "./_components/detailed-view-context-wrapper";

async function ArtItemPage({ params }: { params: Promise<{ locale: Locale; typeId: string; artId: string }> }) {
  const awaitedParams = await params;
  const { locale, typeId, artId } = awaitedParams;
  const [art] = await findArts({ locale, filters: { typeId: Number(typeId), artId: Number(artId) } });
  const session = await getServerSession(authOptions);
  const isInLibrary = await checkIsInLibrary({ artId: Number(artId), userId: Number(session?.user?.id) });
  const libraryStatuses = await findStatuses({ locale, type: "library" });

  return (
    <DetailedViewContextWrapper art={art} isInLibrary={isInLibrary} libraryStatuses={libraryStatuses}>
      <DetailedView />
    </DetailedViewContextWrapper>
  );
}
export default ArtItemPage;
