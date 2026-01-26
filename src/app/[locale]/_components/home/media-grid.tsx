"use client";

import { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { MediaCard } from "./media-card";

type MediaGridProps = {
  items: FindArtsOutput[];
};

export function MediaGrid({ items }: MediaGridProps) {
  const gridTranslations = useTranslations("MediaGrid");

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {items.length} {items.length === 1 ? gridTranslations("result") : gridTranslations("results")}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <MediaCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{gridTranslations("noResults")}</h3>
          <p className="text-muted-foreground">{gridTranslations("tryAdjusting")}</p>
        </div>
      )}
    </div>
  );
}
