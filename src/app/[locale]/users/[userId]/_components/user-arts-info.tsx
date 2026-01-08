import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { FindTypesOutput } from "@/src/lib/services/type/find-types.service";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";

import RatedCard from "./rated-card";

const ChildTabTrigger = ({
  value,
  text,
  activeTab,
  setActiveTab,
}: {
  value: string;
  text: string;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}) => {
  const className = cn(
    `!border-b-transparent max-w-[100px] rounded-md opacity-50 ${activeTab === value && "opacity-100"}`
  );

  return (
    <TabsTrigger value={value} onClick={() => setActiveTab(value)} asChild>
      <Button className={className}>{text}</Button>
    </TabsTrigger>
  );
};

export default function UserArtsInfo() {
  const types: FindTypesOutput[] = []; // TODO: add types from ssr
  const [activeTab, setActiveTab] = useState<string>(String(types[0]?.id));

  // TODO: can make a link with search params and remove useEffect
  useEffect(() => {
    if (types.length) {
      setActiveTab(String(types[0].id));
    }
  }, [types]);

  return (
    <Tabs defaultValue={activeTab} className="w-full lg:mt-6">
      <TabsList className="flex flex-wrap xl:justify-start justify-center gap-4 w-full mb-8 h-max">
        {types.map((type) => (
          <Fragment key={type.id}>
            <ChildTabTrigger
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              value={String(type.id)}
              text={type.catalogName || ""}
            />
          </Fragment>
        ))}
      </TabsList>
      {types.map((type) => (
        <Fragment key={type.id}>
          <TabsContent
            value={String(type.id)}
            className={
              "grid md:grid-cols-2 justify-items-center xl:justify-items-start gap-10 mt-0 lg:grid-cols-1 xl:grid-cols-3 lg:px-0 px-4"
            }
          >
            {/* TODO: add dynamic render */}
            {new Array(10).fill(1).map((_: number, index: number) => (
              <Fragment key={index}>
                <RatedCard />
              </Fragment>
            ))}
          </TabsContent>
        </Fragment>
      ))}
    </Tabs>
  );
}
