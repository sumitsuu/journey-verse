"use client";

import type { Art } from "@/src/lib/types/art";
import type { Type } from "@/src/lib/types/type";
import { createContext, useContext, type ReactNode } from "react";

interface HomePageContextType {
  arts: Art[];
  types: Type[];
}

const HomePageContext = createContext<HomePageContextType | undefined>(undefined);

interface HomePageProviderProps {
  children: ReactNode;
  arts: Art[];
  types: Type[];
}

export function HomeContextWrapper({ children, arts, types }: Readonly<HomePageProviderProps>) {
  return <HomePageContext.Provider value={{ arts, types }}>{children}</HomePageContext.Provider>;
}

export function useHomeContext() {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error("useHomeContext must be used within HomePageProvider");
  }
  return context;
}
