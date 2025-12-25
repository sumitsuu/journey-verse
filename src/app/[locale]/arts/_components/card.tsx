import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { Link } from "@/src/i18n/routing";
import type { Art } from "@/src/lib/types/art";
import { getFileUrl } from "@/src/lib/utils/file-url";
import "moment-timezone";
import Image from "next/image";

type CardProps = {
  item: Art;
};

function Card({ item }: Readonly<CardProps>) {
  return (
    <Link href={`/arts/${item.type.id}/${item.id}`} className={"opacity-80 hover:opacity-100 duration-300"}>
      <Image
        src={item.previewPath ? getFileUrl(item.previewPath) : PICTURE_PLACEHOLDER}
        className={"w-[255px] h-[135px] aspect-video object-fit rounded-[12px]"}
        alt=""
        width={255}
        height={135}
        unoptimized
      />
      <p className={"mt-2 font-medium"}>{item.title}</p>
      <div className={"mt-1 flex gap-4 text-light-purple-1"}>
        <span>{new Date(item.releaseDate).getFullYear()}</span>
        <span>{item.country.name}</span>
      </div>
    </Link>
  );
}

export default Card;
