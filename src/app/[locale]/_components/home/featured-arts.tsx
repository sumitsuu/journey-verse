"use client";

import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { Link } from "@/src/i18n/routing";
import type { Art } from "@/src/lib/types/art";
import { useTranslations } from "next-intl";

type FeaturedArtsProps = {
  arts: Art[];
};

const FeaturedCard = ({ item }: { item: Art }) => {
  return (
    <Link href={`/arts/${item.type.id}/${item.id}`} className={"opacity-80 hover:opacity-100 duration-300"}>
      <img src={PICTURE_PLACEHOLDER} className={"max-w-[240px] max-h-[134px] object-cover rounded-[12px]"} alt="" />
      <p className={"mt-4 font-medium"}>{item.title}</p>
      <p className={"mt-1 text-light-purple-1"}>{item?.genres?.[0]?.name}</p>
    </Link>
  );
};

function FeaturedArts({ arts }: Readonly<FeaturedArtsProps>) {
  const homeTranslations = useTranslations("HomePage");
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
