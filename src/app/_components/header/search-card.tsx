import { Art } from "@/src/lib/types";

interface ISearchCard {
  item: Art;
}

const SearchCard = ({ item }: ISearchCard) => {
  return (
    <div className={"flex items-center my-[15px] px-2 border-b border-1 border-white pb-[15px]"}>
      <div className={"h-[100px]"}>
        <img
          className={"h-full mr-[20px]"}
          src={`${process.env.NEXT_PUBLIC_ARTS_FILES_URL}/${item.previewPath}`}
          alt=""
        />
      </div>
      <div className={"flex flex-col text-white"}>
        <span>{item.title}</span>
        <span>Type: {item?.typeName}</span>
        <span>Genre: {item?.genres?.map((genre) => genre.name)}</span>
        <span>Country: {item.countryName}</span>
      </div>
    </div>
  );
};

export default SearchCard;
