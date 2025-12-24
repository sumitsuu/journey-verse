"use client";

import Link from "next/link";

import Card from "./card";

import type { Art } from "@/src/lib/types/art";

type ArtsProps = {
  arts: Art[];
  title: string;
};

function Arts({ arts, title }: Readonly<ArtsProps>) {
  return (
    <div>
      <div className={"flex justify-between items-center"}>
        <h3 className={"font-bold text-[22px] my-[28px]"}>{title}</h3>
        <Link href={"/arts/1"} className={"opacity-80 hover:opacity-100 transition-opacity duration-300"}>
          View all
        </Link>
      </div>
      <div className={"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-5"}>
        {arts?.map((art, index) => <Card key={art.id || index} item={art} />)}
      </div>
    </div>
  );
}

export default Arts;
