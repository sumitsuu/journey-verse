"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUrlSearchParams from "@/hooks/use-url-search-params";
import { Art, Type } from "@/src/lib/types";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import Card from "./card";
import FiltersDialog from "./filters-dialog";

type ArtsViewProps = {
  types: Type[];
};

export default function ArtsView({ types }: Readonly<ArtsViewProps>) {
  const params = useParams();
  const [typeId, setTypeId] = useState<number>(params.typeId ? Number(params.typeId) : types[0].id);
  const { searchParams, processUrlSearchParams, clearUrlSearchParams } = useUrlSearchParams();
  const arts: Art[] = []; // TODO: add arts from ssr

  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState<boolean>(false);

  return (
    <>
      <FiltersDialog isOpen={isFiltersDialogOpen} setIsOpen={setIsFiltersDialogOpen} typeId={typeId} />
      <div className={"mt-9"}>
        <Tabs defaultValue={typeId.toString()}>
          <TabsList
            className={"border-b-[1px] border-b-light-purple-1 w-full justify-between items-start px-0 pb-6 h-full"}
          >
            <div className={"grid md:grid-cols-5 grid-cols-2 gap-4"}>
              {types.map((type) => (
                <TabsTrigger key={type.id} value={type.id.toString()} onClick={() => setTypeId(type.id)}>
                  {type.catalogName}
                </TabsTrigger>
              ))}
            </div>
            <div className={"flex gap-2 items-center"}>
              <Button onClick={() => setIsFiltersDialogOpen(true)}>
                Filters <SlidersHorizontal />
              </Button>
              <Button onClick={() => clearUrlSearchParams()}>
                <RotateCcw />
              </Button>
            </div>
          </TabsList>
          <div
            className={`grid lg:grid-cols-6 md:grid-cols-4 grid-cols-1 gap-4 mt-4 place-items-center ${arts?.length === 0 && "!grid-cols-1 !place-items-start"}`}
          >
            {arts?.length === 0 && <div>No arts found</div>}
            {arts?.map((art: Art) => <Card key={art.id} item={art} />)}
          </div>
        </Tabs>
      </div>
    </>
  );
}
