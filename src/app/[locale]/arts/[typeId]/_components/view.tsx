"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ArtsView = () => {
  const search = useSearchParams();

  const { typeId }: { typeId: string } = useParams();

  useEffect(() => {
    if (typeId) {
    }
  }, [typeId]);

  useEffect(() => {
    if (typeId) {
    }
  }, [search, typeId]);

  return (
    <div className={"flex"}>
      {/* <div
        className={
          "flex mt-5 w-full flex-wrap gap-y-[80px] gap-x-[30px] md:order-1 order-2 md:justify-start justify-center"
        }
      >
        {(isLoading ? Array.from(new Array(10)) : arts).map(
          (item, index) => {
            const path =
              arts.length > 0 &&
              item?.id &&
              `${pathname}/${item.id}`
            return arts.length > 0 && item?.title ? (
              <Link key={item.id} href={path}>
                <Card item={item} />
              </Link>
            ) : (
              <div key={index} className={"flex flex-col gap-2"}>
                <Skeleton className={"mb-1 w-[188px] h-[282px]"} />
                <Skeleton className={"mb-1 w-[188px] h-[24px]"} />
                <Skeleton className={"mb-1 w-[188px] h-[24px]"} />
              </div>
            )
          }
        )}
      </div>
      <Sort /> */}
    </div>
  );
};

export default ArtsView;
