"use client";

import type { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import type { FindSortOptionsOutput } from "@/src/lib/services/art/find-sort-options.service";
import type { FindGenresOutput } from "@/src/lib/services/genre/find-genres.service";
import type { FindTypesOutput } from "@/src/lib/services/type/find-types.service";
import { createContext, useContext, type ReactNode } from "react";

interface HomePageContextType {
  arts: FindArtsOutput[];
  types: FindTypesOutput[];
  genres: FindGenresOutput[];
  sortOptions: FindSortOptionsOutput;
}

const HomePageContext = createContext<HomePageContextType | undefined>(undefined);

interface HomePageProviderProps {
  children: ReactNode;
  arts: FindArtsOutput[];
  types: FindTypesOutput[];
  genres: FindGenresOutput[];
  sortOptions: FindSortOptionsOutput;
}

export function HomeContextWrapper({ children, arts, types, genres, sortOptions }: Readonly<HomePageProviderProps>) {
  return <HomePageContext.Provider value={{ arts, types, genres, sortOptions }}>{children}</HomePageContext.Provider>;
}

export function useHomeContext() {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error("useHomeContext must be used within HomePageProvider");
  }
  return context;
}
