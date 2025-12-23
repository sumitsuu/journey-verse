import { Art } from "@/src/lib/types";

import "moment-timezone";
import Link from "next/link";

type CardProps = {
  item: Art;
};

function Card({ item }: Readonly<CardProps>) {
  return (
    <Link href={`/arts/${item.typeId}/${item.id}`} className={"opacity-80 hover:opacity-100 duration-300"}>
      <img
        src={`${process.env.NEXT_PUBLIC_ARTS_FILES_URL}/${item.previewPath}`}
        className={"w-[255px] h-[135px] object-cover rounded-[12px]"}
        alt=""
      />
      <p className={"mt-2 font-medium"}>{item.title}</p>
      <div className={"mt-1 flex gap-4 text-light-purple-1"}>
        <span>{new Date(item.releaseDate).getFullYear()}</span>
        <span>{item?.genres?.[0]?.name}</span>
      </div>
    </Link>
  );
}

export default Card;
