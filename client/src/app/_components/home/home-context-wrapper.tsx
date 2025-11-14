"use client";

import { createContext, ReactNode, useContext } from "react";

interface HomePageContextType {
  arts: any;
}

const HomePageContext = createContext<HomePageContextType | undefined>(undefined);

interface HomePageProviderProps {
  children: ReactNode;
  arts: any;
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
