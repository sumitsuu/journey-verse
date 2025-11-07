"use client";

import Header from "@/src/app/_components/header/header";
import { ReactNode } from "react";

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"min-h-screen flex flex-col w-full"}>
      <Header />
      {children}
    </div>
  );
};
export default LayoutWrapper;
