import { DEFAULT_LOCALE } from "../lib/i18n/locales";
import { findArts } from "../lib/services/art/find-arts/find-arts";
import { HomeContextWrapper } from "./_components/home/home-context-wrapper";
import HomeView from "./_components/home/home-view";

async function HomePage() {
  const arts = await findArts({ locale: DEFAULT_LOCALE, filters: {} });

  return (
    <HomeContextWrapper arts={arts}>
      <div className={"flex justify-center w-full py-9"}>
        <div className={"max-w-[1280px]"}>
          <HomeView />
        </div>
      </div>
    </HomeContextWrapper>
  );
}

export default HomePage;
