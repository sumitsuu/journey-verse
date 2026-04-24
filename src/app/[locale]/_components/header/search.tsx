"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Overlay } from "@/components/ui/overlay";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cn } from "@/lib/utils";
import { useSearchArts } from "@/src/lib/queries/arts/use-search-arts";
import { Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ChangeEvent, type KeyboardEvent } from "react";
import SearchCard from "./search-card";

type SearchComponentProps = {
  onSearchChange?: (value: string) => void;
};

const MAX_VISIBLE_RESULTS = 6;

const SearchComponent = ({ onSearchChange }: SearchComponentProps) => {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState<string>(initialSearch);
  const [isFocused, setIsFocused] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTranslations = useTranslations("Search");
  const normalizedSearchValue = searchValue.trim();
  const isOpen = isFocused;
  const searchResultsQuery = useSearchArts({
    locale,
    query: searchValue,
    limit: MAX_VISIBLE_RESULTS,
  });
  const visibleResults = searchResultsQuery.data ?? [];
  const isSearching = normalizedSearchValue.length > 0 && searchResultsQuery.isFetching;

  useLockBodyScroll(isOpen);

  useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearchValue(value);
  };

  const submitSearch = (value: string) => {
    startTransition(() => {
      onSearchChange?.(value);
    });
  };

  const handleClear = () => {
    setSearchValue("");
    if (initialSearch) {
      submitSearch("");
    }
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      handleClose();
      return;
    }

    if (event.key === "Enter") {
      submitSearch(normalizedSearchValue);
      handleClose();
    }
  };

  const handleSearchBlur = () => {
    window.setTimeout(() => {
      if (!searchRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
      }
    }, 0);
  };

  return (
    <>
      {isOpen && (
        <Overlay
          data-state="open"
          aria-label={searchTranslations("close")}
          onMouseDown={handleClose}
          className="cursor-default"
        />
      )}

      <div ref={searchRef} onBlur={handleSearchBlur} className="relative z-50 mx-auto mb-12 max-w-2xl">
        <div
          className={cn(
            "absolute -inset-1 rounded-[22px] bg-gradient-to-r from-primary/50 to-secondary/30 opacity-0 blur transition-opacity duration-300",
            isOpen && "opacity-60"
          )}
        />

        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={searchTranslations("placeholder")}
            value={searchValue}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            className="h-16 w-full rounded-2xl border border-border/40 bg-card py-4 pl-12 pr-12 text-base text-foreground shadow-lg shadow-primary/5 outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40 md:text-base"
          />

          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={searchTranslations("clear")}
              onClick={handleClear}
              className="absolute right-4 top-1/2 size-6 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </Button>
          )}

          {isOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+12px)] overflow-hidden rounded-2xl border border-primary/20 bg-card/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="max-h-[520px] overflow-y-auto p-2">
                {normalizedSearchValue.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    {searchTranslations("startTyping")}
                  </div>
                )}

                {normalizedSearchValue.length > 0 && isSearching && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    {searchTranslations("searching")}
                  </div>
                )}

                {normalizedSearchValue.length > 0 && !isSearching && visibleResults.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    {searchTranslations("noResults")}
                  </div>
                )}

                {normalizedSearchValue.length > 0 && !isSearching && visibleResults.length > 0 && (
                  <div className="space-y-1">
                    {visibleResults.map((item) => (
                      <SearchCard key={item.id} item={item} onSelect={() => setIsFocused(false)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchComponent;
