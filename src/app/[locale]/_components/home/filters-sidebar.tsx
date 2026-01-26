"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useUrlSearchParams from "@/hooks/use-url-search-params";
import debounce from "debounce";
import { Book, Film, Filter, Gamepad2, Sparkles, Tv } from "lucide-react";
import { useTranslations } from "next-intl";

import { useHomeContext } from "./home-context-wrapper";

const mediaTypeIcons: Record<string, React.ComponentType<{ className?: string }> | null> = {
  movie: Film,
  anime: Sparkles,
  tv: Tv,
  game: Gamepad2,
  book: Book,
  manga: Book,
  manhwa: Book,
  manhua: Book,
};

export function FiltersSidebar() {
  const filtersTranslations = useTranslations("Filters");
  const { searchParams, updateMultipleUrlSearchParams, clearUrlSearchParams } = useUrlSearchParams();
  const { sortOptions, types } = useHomeContext();

  const selectedType = searchParams.get("type") || "all";
  const selectedGenreId = searchParams.get("genre");
  const selectedYear = searchParams.get("year") || "all";
  const minRating = Number(searchParams.get("rating")) || 0;

  const [localRating, setLocalRating] = useState(minRating);
  const debouncedSetMinRatingRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    setLocalRating(minRating);
  }, [minRating]);

  useEffect(() => {
    debouncedSetMinRatingRef.current = debounce((ratingValue: number) => {
      console.log("ratingValue", ratingValue);
      updateMultipleUrlSearchParams({ rating: ratingValue > 0 ? ratingValue.toString() : null });
    }, 300);

    return () => {
      debouncedSetMinRatingRef.current?.clear();
    };
  }, []);

  const handleTypeChange = (type: string) => {
    updateMultipleUrlSearchParams({ type: type === "all" ? null : type });
  };

  const handleGenreChange = (genreId: string) => {
    updateMultipleUrlSearchParams({ genre: genreId === "all" ? null : genreId });
  };

  const handleYearChange = (year: string) => {
    updateMultipleUrlSearchParams({ year: year === "all" ? null : year });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLocalRating(value);
    debouncedSetMinRatingRef.current?.(value);
  };

  const handleResetFilters = () => {
    clearUrlSearchParams(["type", "genre", "year", "rating"]);
  };

  return (
    <aside className="lg:w-72 flex-shrink-0">
      <div className="sticky top-24 rounded-2xl bg-card border border-border/40 p-6 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {filtersTranslations("title")}
          </h3>
        </div>

        <div className="space-y-6">
          {/* Type Filter */}
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">{filtersTranslations("mediaType")}</label>
            <div className="space-y-2">
              <Button
                onClick={() => handleTypeChange("all")}
                variant={selectedType === "all" ? "default" : "outline"}
                className="w-full justify-start rounded-xl"
              >
                <span>{filtersTranslations("allTypes")}</span>
              </Button>
              {types.map((type) => {
                if (!type.catalogName) return null;
                const typeKey = type.catalogName.toLowerCase();
                const Icon = mediaTypeIcons[typeKey] || null;
                return (
                  <Button
                    key={type.id}
                    onClick={() => handleTypeChange(typeKey)}
                    variant={selectedType === typeKey ? "default" : "outline"}
                    className="w-full justify-start rounded-xl"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{type.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">{filtersTranslations("genre")}</label>
            <Select value={selectedGenreId || "all"} onValueChange={handleGenreChange}>
              <SelectTrigger className="w-full rounded-xl bg-muted/50 border border-border/40">
                <SelectValue placeholder={filtersTranslations("allGenres")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{filtersTranslations("allGenres")}</SelectItem>
                {sortOptions?.genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">{filtersTranslations("year")}</label>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-full rounded-xl bg-muted/50 border border-border/40">
                <SelectValue placeholder={filtersTranslations("allYears")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{filtersTranslations("allYears")}</SelectItem>
                {sortOptions?.years
                  .sort((a, b) => b - a)
                  .map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">
              {filtersTranslations("minimumRating")}: {localRating.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={localRating}
              onChange={handleRatingChange}
              className="w-full"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          {/* Reset Button */}
          <Button onClick={handleResetFilters} variant="outline" className="w-full rounded-xl">
            {filtersTranslations("reset")}
          </Button>
        </div>
      </div>
    </aside>
  );
}
