"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import artsRequests from "../../../http-requests/arts-requests";
import SearchCard from "./search-card";

const search = async (value: string, setFoundArts: any) => {
  if (value.length > 0) {
    setFoundArts(await artsRequests.searchArts(value));
  }
};

const SearchComponent = () => {
  const [isFocused, setFocused] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [foundArts, setFoundArts] = useState([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const sessionUser = session?.user;

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    await search(event.target.value, setFoundArts);
  };

  const handleOutsideClick = (event: Event) => {
    // Проверяем, что клик был вне элемента wrapperRef
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative w-full text-white flex max-w-[120px] ${sessionUser && "md:mr-[25px]"}`}>
      <Input
        onFocus={() => setFocused(true)}
        onChange={handleSearch}
        placeholder={"Search"}
        className={{
          input: "border-none outline-none max-w-[80px] placeholder:text-light-purple-1",
          wrapper:
            "border-none outline-none bg-black-2 text-light-purple-1 text-base h-[40px] w-[120px] duration-300 hover:bg-black-3",
        }}
        startAdornment={<Search strokeWidth={3} />}
      />
      {isFocused && searchValue && (
        <div className={"absolute w-full h-max bg-black"}>
          {foundArts?.map((item: any) => {
            return <SearchCard key={item.id} item={item} />;
          })}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
