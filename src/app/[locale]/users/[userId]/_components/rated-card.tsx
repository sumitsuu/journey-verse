import { Star } from "@/components/icons/star";

export default function RatedCard() {
  return (
    <div className={"h-full flex lg:gap-4 w-max border border-white/10 xl:p-6 lg:p-0 p-4 rounded-[20px] shadow-2xl"}>
      <img
        alt={"witcher"}
        className={"object-cover lg:h-[235px] md:w-[145px] h-[180px] w-[80px] rounded-[20px]"}
        src={`${process.env.NEXT_PUBLIC_ARTS_FILES_URL}/witcher.png`}
        width={175}
        height={235}
      />
      <div className={"p-4 flex flex-col gap-4 justify-center"}>
        <p className={"lg:text-3xl text-2xl font-bold"}>Witcher</p>
        <div className={"flex flex-col gap-2"}>
          <span className={"flex gap-1"}>
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </span>
          <p className={"max-w-[120px]"}>Rated a week ago</p>
        </div>
      </div>
    </div>
  );
}
