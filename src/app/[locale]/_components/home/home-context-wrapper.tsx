"use client";

import type { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import type { FindTypesOutput } from "@/src/lib/services/type/find-types.service";
import { createContext, useContext, type ReactNode } from "react";

interface HomePageContextType {
  arts: FindArtsOutput[];
  types: FindTypesOutput[];
}

const HomePageContext = createContext<HomePageContextType | undefined>(undefined);

interface HomePageProviderProps {
  children: ReactNode;
  arts: FindArtsOutput[];
  types: FindTypesOutput[];
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
