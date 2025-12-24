"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUrlSearchParams from "@/hooks/use-url-search-params";
import type { Art } from "@/src/lib/types/art";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useArtsContext } from "../[typeId]/_components/arts-context-wrapper";
import Card from "./card";
import FiltersDialog from "./filters-dialog";

export default function ArtsView() {
  const { clearUrlSearchParams } = useUrlSearchParams();
  const { types, arts } = useArtsContext();
  const { typeId } = useParams<{ typeId: string }>();

  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState<boolean>(false);

  return (
    <>
      <FiltersDialog isOpen={isFiltersDialogOpen} setIsOpen={setIsFiltersDialogOpen} />
      <div className={"mt-9"}>
        <Tabs value={typeId ?? types[0].id.toString()}>
          <TabsList
            className={"border-b-[1px] border-b-light-purple-1 w-full justify-between items-start px-0 pb-6 h-full"}
          >
            <div className={"grid md:grid-cols-5 grid-cols-2 gap-4"}>
              {types.map((type) => (
                <TabsTrigger key={type.id} value={type.id.toString()} asChild>
                  <Link href={`/arts/${type.id}`}>{type.catalogName}</Link>
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
