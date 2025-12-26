"use client";

import type { Art } from "@/src/lib/types/art";
import type { Status } from "@/src/lib/types/status";
import { createContext, useContext, type ReactNode } from "react";

interface DetailedViewContextType {
  art: Art;
  isInLibrary: boolean;
  libraryStatuses: Status[];
}

const DetailedViewContext = createContext<DetailedViewContextType | undefined>(undefined);

interface DetailedViewProviderProps {
  children: ReactNode;
  art: Art;
  isInLibrary: boolean;
  libraryStatuses: Status[];
}

export function DetailedViewContextWrapper({
  children,
  art,
  isInLibrary,
  libraryStatuses,
}: Readonly<DetailedViewProviderProps>) {
  return (
    <DetailedViewContext.Provider value={{ art, isInLibrary, libraryStatuses }}>
      {children}
    </DetailedViewContext.Provider>
  );
}

export function useDetailedViewContext() {
  const context = useContext(DetailedViewContext);
  if (!context) {
    throw new Error("useDetailedViewContext must be used within DetailedViewProvider");
  }
  return context;
}
