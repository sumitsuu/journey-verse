"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { MultiSelect } from "@/components/ui/multi-select";
import { SelectComponent } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createArtAction } from "@/src/lib/actions/art/create-art.action";
import type { FindCountriesOutput } from "@/src/lib/services/country/find-countries.service";
import type { FindGenresOutput } from "@/src/lib/services/genre/find-genres.service";
import type { FindStatusesOutput } from "@/src/lib/services/status/find-statuses.service";
import type { FindTypesOutput } from "@/src/lib/services/type/find-types.service";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateArtSchema = z.object({
  releaseDate: z.date(),
  episodes: z.coerce.number().min(1),
  countryId: z.coerce.number().min(1),
  typeId: z.coerce.number().min(1),
  statusId: z.coerce.number().min(1),
  genres: z.array(z.coerce.number()).min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  previewPath: z
    .any()
    .refine(
      (val) =>
        val instanceof FileList && val.length > 0 && ["image/jpeg", "image/png", "image/jpg"].includes(val[0].type),
      { message: "Only JPEG/PNG images allowed" }
    ),
});

export const CreateArtView = () => {
  const countries: FindCountriesOutput[] = []; // TODO: add countries from ssr
  const types: FindTypesOutput[] = []; // TODO: add types from ssr
  const statuses: FindStatusesOutput[] = []; // TODO: add statuses from ssr
  const genres: FindGenresOutput[] = []; // TODO: add genres from ssr

  const form = useForm({
    resolver: zodResolver(CreateArtSchema),
    defaultValues: {
      releaseDate: new Date(),
      episodes: 0,
      countryId: 1,
      typeId: 1,
      statusId: 1,
      genres: [],
      title: "",
      description: "",
      previewPath: "",
    },
    mode: "onChange",
  });

  const createArtMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createArtAction(data);
    },
    onSuccess: () => {
      toast({
        title: "Art was created successfully",
        variant: "success",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: error.message || "An error occurred while creating the art",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof CreateArtSchema>) => {
    const formData = new FormData();
    formData.append("releaseDate", data.releaseDate.toISOString());
    if (data.episodes) {
      formData.append("episodes", data.episodes.toString());
    }
    formData.append("countryId", data.countryId.toString());
    formData.append("typeId", data.typeId.toString());
    formData.append("statusId", data.statusId.toString());
    formData.append("genres[]", data.genres.join(","));
    formData.append("title", data.title);
    formData.append("description", data.description);

    if (data.previewPath) {
      formData.append("previewPath", data.previewPath[0]);
    }

    createArtMutation.mutate(formData);
  };

  return (
    <div className={"w-full flex items-center justify-center h-full"}>
      <Form {...form}>
        <form className={"w-full max-w-[400px] flex flex-col gap-4"} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name={"title"}
            render={({ field }) => <Input value={field.value} onChange={field.onChange} placeholder={"Title"} />}
          />
          <FormField
            control={form.control}
            name={"description"}
            render={({ field }) => (
              <Textarea value={field.value} onChange={field.onChange} placeholder={"Description"} />
            )}
          />
          <FormField
            control={form.control}
            name={"episodes"}
            render={({ field }) => <Input value={field.value} onChange={field.onChange} placeholder={"Episodes"} />}
          />
          <FormField
            control={form.control}
            name={"countryId"}
            render={({ field }) => (
              <SelectComponent
                options={countries.map((item: FindCountriesOutput) => ({
                  label: item.name || "",
                  value: item.id.toString(),
                }))}
                value={field.value?.toString()}
                onValueChange={field.onChange}
                placeholder={"Country"}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"typeId"}
            render={({ field }) => (
              <SelectComponent
                options={types.map((item: FindTypesOutput) => ({
                  label: item.name || "",
                  value: item.id.toString(),
                }))}
                value={field.value?.toString()}
                onValueChange={field.onChange}
                placeholder={"Type"}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"statusId"}
            render={({ field }) => (
              <SelectComponent
                options={statuses.map((item: FindStatusesOutput) => ({
                  label: item.name || "",
                  value: item.id.toString(),
                }))}
                value={field.value?.toString()}
                onValueChange={field.onChange}
                placeholder={"Status"}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"genres"}
            render={({ field }) => (
              <MultiSelect
                options={genres.map((item: FindGenresOutput) => ({
                  label: item.name || "",
                  value: item.id.toString(),
                }))}
                value={field.value?.toString() || undefined}
                onValueChange={field.onChange}
                placeholder={"Genres"}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"previewPath"}
            render={({ field }) => (
              <Input type={"file"} onChange={(e) => field.onChange(e.target.files)} placeholder={"Preview Path"} />
            )}
          />
          <FormField
            control={form.control}
            name={"releaseDate"}
            render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} placeholder={"Date"} />}
          />

          <Button variant={"secondary"} type={"submit"} disabled={createArtMutation.isPending}>
            {createArtMutation.isPending ? <Loader /> : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
