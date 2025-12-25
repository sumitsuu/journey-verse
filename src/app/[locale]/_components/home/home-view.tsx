"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";
import Arts from "./arts";
import FeaturedArts from "./featured-arts";
import { useHomeContext } from "./home-context-wrapper";

function HomeView() {
  const { arts } = useHomeContext();
  const homeTranslations = useTranslations("HomePage");

  return (
    <>
      <div className={"relative max-w-full max-h-[420px]"}>
        <Image
          src="/images/home.jpg"
          width={1280}
          height={420}
          alt="Picture of the author"
          className={"rounded-[12px] h-full max-h-[420px] object-fill"}
        />
        <div className={"absolute bottom-10 left-[100px]"}>
          <p className={"text-4xl font-bold drop-shadow-md"}>{homeTranslations("heroTitle")}</p>
          <p className={"text-xl drop-shadow-md"}>{homeTranslations("heroDescription")}</p>
        </div>
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
    </>
  );
}

export default HomeView;
