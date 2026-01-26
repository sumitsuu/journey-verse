"use client";

import useUrlSearchParams from "@/hooks/use-url-search-params";
import SearchComponent from "../header/search";
import { Carousel } from "./carousel";
import { FiltersSidebar } from "./filters-sidebar";
import { useHomeContext } from "./home-context-wrapper";
import { MediaGrid } from "./media-grid";

type HomeViewProps = {
  searchQuery?: string;
};

function HomeView({ searchQuery: initialSearchQuery = "" }: HomeViewProps) {
  const { arts } = useHomeContext();
  const { updateMultipleUrlSearchParams } = useUrlSearchParams();

  const handleSearchChange = (value: string) => {
    updateMultipleUrlSearchParams({ search: value || null });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchComponent onSearchChange={handleSearchChange} />
      <Carousel trendingItems={arts || []} />

      {/* Filters and Grid */}
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <FiltersSidebar />
        <MediaGrid items={arts} />
      </div>
    </div>
  );
}

export default HomeView;
