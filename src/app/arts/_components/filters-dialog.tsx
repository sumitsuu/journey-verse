import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { SelectComponent } from "@/components/ui/select";
import useUrlSearchParams from "@/hooks/use-url-search-params";
import { RATINGS } from "@/lib/constants";
import { Genre } from "@/src/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type FiltersDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  typeId: number;
};

const FilteringSchema = z.object({
  genres: z.array(z.string()).optional(),
  rating: z.string().optional(),
  yearStart: z.string().optional(),
  yearEnd: z.string().optional(),
});

export default function FiltersDialog({ isOpen, setIsOpen, typeId }: Readonly<FiltersDialogProps>) {
  const { updateMultipleUrlSearchParams, searchParams } = useUrlSearchParams();
  const form = useForm({
    resolver: zodResolver(FilteringSchema),
    defaultValues: {
      genres: searchParams.getAll("genres").length > 0 ? searchParams.getAll("genres") : undefined,
      rating: searchParams.get("rating") ?? undefined,
      yearStart: searchParams.get("yearStart") ?? undefined,
      yearEnd: searchParams.get("yearEnd") ?? undefined,
    },
  });
  const sortOptions: any = []; // TODO: add sort options from ssr
  const yearsStart = sortOptions?.years.filter((year: number) => {
    return form.getValues("yearEnd") ? year <= Number(form.getValues("yearEnd")) : year;
  });

  const yearsEnd = sortOptions?.years.filter((year: number) => {
    return form.getValues("yearStart") ? year >= Number(form.getValues("yearStart")) : year;
  });

  const onSubmit = (data: any) => {
    updateMultipleUrlSearchParams(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtering</DialogTitle>
          <DialogDescription>Choose the filters you want to apply to the search.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className={"flex flex-col gap-2"} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="genres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genres</FormLabel>
                  <MultiSelect
                    options={sortOptions?.genres.map((genre: Genre) => ({
                      label: genre.name,
                      value: genre.id.toString(),
                    }))}
                    onValueChange={field.onChange}
                    value={field.value as string[]}
                    defaultValue={field.value as string[]}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Rating</FormLabel>
                  <SelectComponent
                    options={RATINGS.map((rating) => ({
                      label: rating.toString(),
                      value: rating.toString(),
                    }))}
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    defaultValue={field.value}
                    placeholder="Select a rating"
                  />
                </FormItem>
              )}
            />

            <div className={"flex gap-2 justify-between w-full"}>
              <FormField
                control={form.control}
                name="yearStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year (Since)</FormLabel>
                    <SelectComponent
                      options={yearsStart.map((year: number) => ({
                        label: year.toString(),
                        value: year.toString(),
                      }))}
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      defaultValue={field.value}
                      placeholder="Select a year"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year (Until)</FormLabel>
                    <SelectComponent
                      options={yearsEnd.map((year: number) => ({
                        label: year.toString(),
                        value: year.toString(),
                      }))}
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      defaultValue={field.value}
                      placeholder="Select a year"
                    />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className={"mt-4"}>
              <Button type="submit">Apply filters</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
