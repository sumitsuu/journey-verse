import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { Link } from "@/src/i18n/routing";
import type { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import { getFileUrl } from "@/src/lib/utils/file-url";
import "moment-timezone";
import Image from "next/image";

type CardProps = {
  item: FindArtsOutput;
};

function Card({ item }: Readonly<CardProps>) {
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
}

export default Card;
