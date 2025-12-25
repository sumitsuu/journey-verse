import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import type { Art } from "@/src/lib/types/art";

import { Link } from "@/src/i18n/routing";
import { getFileUrl } from "@/src/lib/utils/file-url";
import "moment-timezone"; // TODO: replace with luxon
import Image from "next/image";

type CardProps = {
  item: Art;
};

function Card({ item }: Readonly<CardProps>) {
  return (
    <Link href={`/arts/${item.type.id}/${item.id}`} className={"opacity-80 hover:opacity-100 duration-300"}>
      <Image
        src={item.previewPath ? getFileUrl(item.previewPath) : PICTURE_PLACEHOLDER}
        className={"max-w-[175px] h-[235px] object-cover rounded-[12px]"}
        alt=""
        width={175}
        height={235}
        unoptimized
      />
      <p className={"mt-2 font-medium"}>{item.title}</p>
      <div className={"mt-1 flex gap-4 text-light-purple-1"}>
        <span>{new Date(item.releaseDate).getFullYear()}</span>
        <span>{item?.genres[0]?.name}</span>
      </div>
    </Link>
  );
}

export default Card;
