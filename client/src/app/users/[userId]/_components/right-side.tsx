import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypeQueries } from "@/lib/queries/type.queries";
import { cn } from "@/lib/utils";
import { Type } from "@/src/types/models/type.types";
import { useQuery } from "@tanstack/react-query";
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

export default function RightSide() {
  const { data: types = [], isLoading } = useQuery(TypeQueries.getTypes());
  const [activeTab, setActiveTab] = useState<string>(String(types[0]?.id));

  // TODO: можно сделать ссылку с search params и убрать useEffect
  useEffect(() => {
    if (types.length) {
      setActiveTab(String(types[0].id));
    }
  }, [types]);

  if (isLoading) return <Loader />;

  return (
    <Tabs defaultValue={activeTab} className="w-full lg:mt-6">
      <TabsList className="flex flex-wrap xl:justify-start justify-center gap-4 w-full mb-8 h-max">
        {types.map((type: Type) => (
          <Fragment key={type.id}>
            <ChildTabTrigger
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              value={String(type.id)}
              text={type.catalogName}
            />
          </Fragment>
        ))}
      </TabsList>
      {types.map((type: Type) => (
        <Fragment key={type.id}>
          <TabsContent
            value={String(type.id)}
            className={
              "grid md:grid-cols-2 justify-items-center xl:justify-items-start gap-10 mt-0 lg:grid-cols-1 xl:grid-cols-3 lg:px-0 px-4"
            }
          >
            {/* TODO: добавить динамический рендер */}
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
