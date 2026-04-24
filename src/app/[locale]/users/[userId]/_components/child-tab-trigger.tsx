import { Button } from "@/components/ui/button";
import { TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Dispatch, SetStateAction } from "react";

type ChildTabTriggerProps = {
  value: string;
  text: string;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

export const ChildTabTrigger = ({ value, text, activeTab, setActiveTab }: ChildTabTriggerProps) => {
  const className = cn(
    "!border-b-transparent max-w-[100px] rounded-md opacity-50",
    activeTab === value && "opacity-100"
  );

  return (
    <TabsTrigger value={value} onClick={() => setActiveTab(value)} asChild>
      <Button className={className}>{text}</Button>
    </TabsTrigger>
  );
};
