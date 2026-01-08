"use client";

import type { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import type { FindSortOptionsOutput } from "@/src/lib/services/art/find-sort-options.service";
import type { FindTypesOutput } from "@/src/lib/services/type/find-types.service";
import { createContext, useContext, type ReactNode } from "react";

interface ArtsContextType {
  types: FindTypesOutput[];
  arts: FindArtsOutput[];
  sortOptions: FindSortOptionsOutput;
}

const ArtsContext = createContext<ArtsContextType | undefined>(undefined);

interface ArtsProviderProps {
  children: ReactNode;
  types: FindTypesOutput[];
  arts: FindArtsOutput[];
  sortOptions: FindSortOptionsOutput;
}

export function ArtsContextWrapper({ children, types, arts, sortOptions }: Readonly<ArtsProviderProps>) {
  return <ArtsContext.Provider value={{ types, arts, sortOptions }}>{children}</ArtsContext.Provider>;
}

export function useArtsContext() {
  const context = useContext(ArtsContext);
  if (!context) {
    throw new Error("useArtsContext must be used within ArtsProvider");
  }
  return context;
}
