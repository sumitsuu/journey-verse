"use client";

import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { Link } from "@/src/i18n/routing";
import type { Art } from "@/src/lib/types/art";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useHomeContext } from "./home-context-wrapper";

const FeaturedCard = ({ item }: { item: Art }) => {
  return (
    <Link href={`/arts/${item.type.id}/${item.id}`} className={"opacity-80 hover:opacity-100 duration-300"}>
      <Image
        src={item.previewPath ? getFileUrl(item.previewPath) : PICTURE_PLACEHOLDER}
        className={"max-w-[175px] h-[235px] rounded-[12px] aspect-video object-cover"}
        alt=""
        width={175}
        height={235}
        quality={90}
      />
      <p className={"mt-2 font-medium"}>{item.title}</p>
      <div className={"mt-1 flex gap-4 text-light-purple-1"}>
        <span>{new Date(item.releaseDate).getFullYear()}</span>
        <span>{item.country.name}</span>
      </div>
    </Link>
  );
};

function FeaturedArts() {
  const homeTranslations = useTranslations("HomePage");
  const { arts } = useHomeContext();
  const tmpArts = new Array(5).fill(arts?.[0]);
  return (
    <div>
      <h3 className={"font-bold text-[22px] my-[28px]"}>{homeTranslations("featured")}</h3>
      <div className={"flex gap-5"}>
        {arts?.length > 0 && tmpArts?.map((art, index) => <FeaturedCard key={index} item={art} />)}
      </div>
    </div>
  );
}

export default FeaturedArts;
