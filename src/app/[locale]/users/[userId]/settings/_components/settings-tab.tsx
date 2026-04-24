"use client";

import { TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

type SettingsTabProps = {
  value: string;
  children: ReactNode;
};

export const SettingsTab = ({ value, children }: SettingsTabProps) => {
  return (
    <TabsTrigger value={value} className={"justify-start w-full shadow-none bg-transparent"}>
      {children}
    </TabsTrigger>
  );
};
