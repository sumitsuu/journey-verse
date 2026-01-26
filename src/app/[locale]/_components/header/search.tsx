"use client";

import debounce from "debounce";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type SearchComponentProps = {
  onSearchChange?: (value: string) => void;
};

const SearchComponent = ({ onSearchChange }: SearchComponentProps) => {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState<string>(initialSearch);
  const debouncedOnSearchChangeRef = useRef<ReturnType<typeof debounce> | null>(null);
  const searchTranslations = useTranslations("Search");

  useEffect(() => {
    debouncedOnSearchChangeRef.current = debounce((value: string) => {
      onSearchChange?.(value);
    }, 300);

    return () => {
      debouncedOnSearchChangeRef.current?.clear();
    };
  }, [onSearchChange]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedOnSearchChangeRef.current?.(value);
  };

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchTranslations("placeholder")}
          value={searchValue}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border/40 text-foreground placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all shadow-lg shadow-primary/5"
        />
      </div>
    </div>
  );
};

export default SearchComponent;
