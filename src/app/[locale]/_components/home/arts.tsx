"use client";

import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

import Card from "./card";

import { useHomeContext } from "./home-context-wrapper";

type ArtsProps = {
  title: string;
};

function Arts({ title }: Readonly<ArtsProps>) {
  const homeTranslations = useTranslations("HomePage");
  const { types, arts } = useHomeContext();
  return (
    <div>
      <div className={"flex justify-between items-center"}>
        <h3 className={"font-bold text-[22px] my-[28px]"}>{title}</h3>
        <Link href={`/arts/${types[0].id}`} className={"opacity-80 hover:opacity-100 transition-opacity duration-300"}>
          {homeTranslations("viewAll")}
        </Link>
      </div>
      <div className={"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-5"}>
        {arts?.map((art, index) => <Card key={art.id || index} item={art} />)}
      </div>
    </div>
  );
}

export default Arts;
