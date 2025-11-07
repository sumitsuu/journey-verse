"use client";

import { ArtsQueries } from "@/lib/queries/arts.queries";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Arts from "./arts";
import FeaturedArts from "./featured-arts";

function HomeView() {
  const { data: arts } = useQuery(ArtsQueries.getArts(1, {}));
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
          <p className={"text-4xl font-bold drop-shadow-md"}>JourneyVerse</p>
          <p className={"text-xl drop-shadow-md"}>
            Discover new worlds through movies, games, anime, and books. Rate, review, and share your journey with
            friends!
          </p>
        </div>
      </div>
      {arts && arts?.length > 0 && (
        <>
          <FeaturedArts arts={arts} />
          <Arts arts={arts} title={"Trending"} />
          <Arts arts={arts} title={"Recenty rated by friends"} />
        </>
      )}
    </>
  );
}

export default HomeView;
