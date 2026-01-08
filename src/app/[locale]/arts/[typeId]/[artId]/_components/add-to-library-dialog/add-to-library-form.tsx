"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { SelectComponent } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/src/i18n/routing";
import { createLibraryAction } from "@/src/lib/actions/library/create-library.action";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { useDetailedViewContext } from "../detailed-view-context-wrapper";

type AddToLibraryFormProps = {
  onOpenChange: () => void;
};

const createValidationSchema = (maxEpisodes: number, addToLibraryTranslations: ReturnType<typeof useTranslations>) =>
  z.object({
    episodes: z.coerce
      .number()
      .min(0)
      .superRefine((val, ctx) => {
        if (maxEpisodes === -1) {
          // allow null or undefined
        } else {
          if (val > maxEpisodes) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              maximum: maxEpisodes,
              type: "number",
              inclusive: true,
              message: addToLibraryTranslations("validation.episodesMax", { max: maxEpisodes }),
            });
          }
        }
      })
      .optional(),
    rating: z.coerce.number().min(0).max(10),
    status: z.coerce.number(),
  });

const AddToLibraryForm = ({ onOpenChange }: AddToLibraryFormProps) => {
  const addToLibraryTranslations = useTranslations("AddToLibrary");
  const { art, libraryStatuses } = useDetailedViewContext();
  const maxEpisodes = art.episodes;
  const router = useRouter();

  const validationSchema = createValidationSchema(maxEpisodes, addToLibraryTranslations);

  const form = useForm<z.infer<typeof validationSchema>>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      episodes: undefined,
      rating: undefined,
      status: undefined,
    },
  });
  const { data: session } = useSession();
  const user = session?.user;

  const { mutate: createLibraryMutation, isPending } = useMutation({
    mutationFn: createLibraryAction,
    onSuccess: () => {
      router.refresh();
      toast({
        title: addToLibraryTranslations("messages.createdSuccess"),
        variant: "success",
      });
      onOpenChange();
    },
    onError: () => {
      toast({
        title: addToLibraryTranslations("messages.createError"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof validationSchema>) => {
    if (user?.id) {
      createLibraryMutation({
        artId: art.id,
        userId: Number(user.id),
        statusId: data.status,
        rating: data.rating,
        episodes: data.episodes ?? 1,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className={`w-full h-full flex flex-col gap-4 ${maxEpisodes > 1 && "justify-center"}`}
        onSubmit={form.handleSubmit((data) => {
          onSubmit(data);
        })}
      >
        <FormField
          name="episodes"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder={addToLibraryTranslations("watchedEpisodes", { max: maxEpisodes })}
              variant={fieldState.invalid ? "invalid" : "default"}
              disabled={maxEpisodes === 1}
            />
          )}
        />

        <FormField
          name="rating"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder={addToLibraryTranslations("rating")}
              variant={fieldState.invalid ? "invalid" : "default"}
            />
          )}
        />
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <SelectComponent
              {...field}
              placeholder={addToLibraryTranslations("selectStatus")}
              options={libraryStatuses.map((item) => ({
                label: item.name,
                value: item.id.toString(),
              }))}
            />
          )}
        />
        <Button variant={"secondary"} type="submit" disabled={isPending}>
          {isPending ? <Loader /> : addToLibraryTranslations("add")}
        </Button>
      </form>
    </Form>
  );
};

export default AddToLibraryForm;
