"use client";

import type { FindSortOptionsOutput } from "@/src/lib/services/art/find-sort-options/schemas";
import type { Art } from "@/src/lib/types/art";
import type { Type } from "@/src/lib/types/type";
import { createContext, useContext, type ReactNode } from "react";

interface ArtsContextType {
  types: Type[];
  arts: Art[];
  sortOptions: FindSortOptionsOutput;
}

const ArtsContext = createContext<ArtsContextType | undefined>(undefined);

interface ArtsProviderProps {
  children: ReactNode;
  types: Type[];
  arts: Art[];
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
