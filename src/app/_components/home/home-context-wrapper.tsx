"use client";

import { Art } from "@/src/lib/types";
import { createContext, useContext, type ReactNode } from "react";

interface HomePageContextType {
  arts: Art[];
}

const HomePageContext = createContext<HomePageContextType | undefined>(undefined);

interface HomePageProviderProps {
  children: ReactNode;
  arts: Art[];
}

export function HomeContextWrapper({ children, arts }: Readonly<HomePageProviderProps>) {
  return <HomePageContext.Provider value={{ arts }}>{children}</HomePageContext.Provider>;
}

export function useHomeContext() {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error("useHomeContext must be used within HomePageProvider");
  }
  return context;
}
