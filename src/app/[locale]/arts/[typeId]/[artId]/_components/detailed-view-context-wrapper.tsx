"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { ArtRatingDistributionItem } from "@/src/lib/services/art/find-art-rating-distribution.service";
import type { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import type { FindLibraryOutput } from "@/src/lib/services/library/find-library.service";
import type { FindStatusesOutput } from "@/src/lib/services/status/find-statuses.service";

interface DetailedViewContextType {
  art: FindArtsOutput;
  libraryStatuses: FindStatusesOutput[];
  library: FindLibraryOutput | undefined;
  ratingDistribution: ArtRatingDistributionItem[];
}

const DetailedViewContext = createContext<DetailedViewContextType | undefined>(undefined);

interface DetailedViewProviderProps {
  children: ReactNode;
  art: FindArtsOutput;
  library: FindLibraryOutput | undefined;
  libraryStatuses: FindStatusesOutput[];
  ratingDistribution: ArtRatingDistributionItem[];
}

export const DetailedViewContextWrapper = ({
  children,
  art,
  library,
  libraryStatuses,
  ratingDistribution,
}: Readonly<DetailedViewProviderProps>) => {
  return (
    <DetailedViewContext.Provider value={{ art, library, libraryStatuses, ratingDistribution }}>
      {children}
    </DetailedViewContext.Provider>
  );
};

export function useDetailedViewContext() {
  const context = useContext(DetailedViewContext);
  if (!context) {
    throw new Error("useDetailedViewContext must be used within DetailedViewProvider");
  }
  return context;
}
