import { findTypes } from "@/src/lib/services/type/find-types/find-types.service";
import { Locale } from "../../lib/i18n/locales";
import { findArts } from "../../lib/services/art/find-arts/find-arts.service";
import { HomeContextWrapper } from "./_components/home/home-context-wrapper";
import HomeView from "./_components/home/home-view";

async function HomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const arts = await findArts({ locale, filters: {} });
  const types = await findTypes({ locale });

  return (
    <HomeContextWrapper types={types} arts={arts}>
      <div className={"flex justify-center w-full py-9"}>
        <div className={"max-w-[1280px]"}>
          <HomeView />
        </div>
      </div>
    </HomeContextWrapper>
  );
}

export default HomePage;
