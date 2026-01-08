import type { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import { getFileUrl } from "@/src/lib/utils/file-url";
import Image from "next/image";

interface ISearchCard {
  item: FindArtsOutput;
}

const SearchCard = ({ item }: ISearchCard) => {
  return (
    <div className={"flex items-center my-[15px] px-2 border-b border-1 border-white pb-[15px]"}>
      <div className={"h-[100px]"}>
        <Image
          className={"h-full mr-[20px]"}
          src={item.previewPath ? getFileUrl(item.previewPath) : ""}
          alt=""
          width={100}
          height={100}
          quality={90}
        />
      </div>
      <div className={"flex flex-col text-white"}>
        <span>{item.title}</span>
        <span>Type: {item?.type.name}</span>
        <span>Genre: {item?.genres?.map((genre) => genre.name)}</span>
        <span>Country: {item.country.name}</span>
      </div>
    </div>
  );
};

export default SearchCard;
