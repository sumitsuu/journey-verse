"use client";

import { ReactNode } from "react";
import Header from "./header/header";

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"min-h-screen flex flex-col w-full"}>
      <Header />
      {children}
    </div>
  );
};
export default LayoutWrapper;
