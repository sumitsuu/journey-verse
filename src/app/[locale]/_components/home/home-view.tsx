"use client";

import { useTranslations } from "next-intl";
import Arts from "./arts";
import FeaturedArts from "./featured-arts";
import { useHomeContext } from "./home-context-wrapper";

function HomeView() {
  const { arts } = useHomeContext();
  const homeTranslations = useTranslations("HomePage");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">{homeTranslations("heroTitle")}</h1>
        <p className={"text-xl drop-shadow-md"}>{homeTranslations("heroDescription")}</p>
      </div>
      {arts && arts?.length > 0 && (
        <>
          <FeaturedArts arts={arts} />
          <Arts arts={arts} title={homeTranslations("trending")} />
          <div className={"h-[100px] mt-10"}>
            <p className={"text-2xl font-bold"}>{homeTranslations("recentlyRatedByFriends")}</p>
            <p className={"text-xl"}>{homeTranslations("comingSoon")}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default HomeView;
