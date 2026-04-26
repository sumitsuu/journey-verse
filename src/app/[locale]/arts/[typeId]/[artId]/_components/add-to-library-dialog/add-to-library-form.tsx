"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "@/src/i18n/routing";
import { createLibraryAction } from "@/src/lib/actions/library/create-library.action";
import { updateLibraryEntryAction } from "@/src/lib/actions/library/update-library-entry.action";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useDetailedViewContext } from "../detailed-view-context-wrapper";

type AddToLibraryFormProps = {
  isOpen: boolean;
  initialStatusId: number | null;
  onOpenChange: (open: boolean) => void;
};

const createValidationSchema = (maxEpisodes: number, addToLibraryTranslations: ReturnType<typeof useTranslations>) =>
  z.object({
    episodes: z.coerce
      .number()
      .min(0)
      .superRefine((val, ctx) => {
        if (maxEpisodes === -1) {
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

const AddToLibraryForm = ({ isOpen, initialStatusId, onOpenChange }: AddToLibraryFormProps) => {
  const addToLibraryTranslations = useTranslations("AddToLibrary");
  const { art, library, libraryStatuses } = useDetailedViewContext();
  const maxEpisodes = art.episodes;
  const router = useRouter();

  const validationSchema = createValidationSchema(maxEpisodes, addToLibraryTranslations);

  const form = useForm<z.infer<typeof validationSchema>>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      episodes: maxEpisodes > 1 ? 1 : 1,
      rating: 0,
      status: undefined,
    },
  });

  const [selectMountToken, setSelectMountToken] = useState(0);
  const prevIsOpenRef = useRef(false);

  useLayoutEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setSelectMountToken((t) => t + 1);
    }
    prevIsOpenRef.current = isOpen;

    if (!isOpen) {
      return;
    }
    const episodesValue = library ? library.episodes : maxEpisodes > 1 ? 1 : 1;
    const ratingRaw = library?.rating;
    const ratingValue =
      ratingRaw === null || ratingRaw === undefined
        ? 0
        : (() => {
            const n = Number(ratingRaw);
            return Number.isNaN(n) ? 0 : n;
          })();
    const rawStatus = initialStatusId ?? library?.statusId;
    let statusNum: number | undefined;
    if (rawStatus !== null && rawStatus !== undefined && String(rawStatus) !== "") {
      const n = Number(rawStatus);
      if (Number.isFinite(n)) {
        statusNum = n;
      }
    }
    form.reset({
      episodes: episodesValue,
      rating: ratingValue,
      status: statusNum,
    });
  }, [isOpen, initialStatusId, maxEpisodes, library, form]);
  const { data: session } = useSession();
  const user = session?.user;

  const { mutate: createLibraryMutation, isPending: isCreatePending } = useMutation({
    mutationFn: createLibraryAction,
    onSuccess: () => {
      router.refresh();
      toast({
        title: addToLibraryTranslations("messages.createdSuccess"),
        variant: "success",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: addToLibraryTranslations("messages.createError"),
        variant: "destructive",
      });
    },
  });

  const { mutate: updateLibraryMutation, isPending: isUpdatePending } = useMutation({
    mutationFn: updateLibraryEntryAction,
    onSuccess: () => {
      router.refresh();
      toast({
        title: addToLibraryTranslations("messages.updatedSuccess"),
        variant: "success",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: addToLibraryTranslations("messages.updateError"),
        variant: "destructive",
      });
    },
  });

  const isPending = isCreatePending || isUpdatePending;

  const onSubmit = async (data: z.infer<typeof validationSchema>) => {
    if (!user?.id) {
      return;
    }
    const userId = Number(user.id);
    if (library) {
      updateLibraryMutation({
        artId: art.id,
        userId,
        statusId: data.status,
        rating: data.rating,
        episodes: data.episodes ?? library.episodes ?? 0,
      });
    } else {
      createLibraryMutation({
        artId: art.id,
        userId,
        statusId: data.status,
        rating: data.rating,
        episodes: data.episodes ?? 1,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("w-full flex flex-col gap-4")}
        onSubmit={form.handleSubmit((data) => {
          onSubmit(data);
        })}
      >
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => {
            const n = field.value != null ? Number(field.value) : NaN;
            const statusStr = Number.isFinite(n) ? String(n) : undefined;
            return (
              <FormItem>
                <FormLabel className="text-foreground">{addToLibraryTranslations("status")}</FormLabel>
                <Select
                  key={selectMountToken}
                  value={statusStr}
                  onValueChange={(value) => field.onChange(Number(value))}
                  onOpenChange={(open) => {
                    if (!open) {
                      field.onBlur();
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder={addToLibraryTranslations("selectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {libraryStatuses.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="episodes"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {addToLibraryTranslations("watchedEpisodes", { max: maxEpisodes })}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  max={maxEpisodes > 0 ? maxEpisodes : undefined}
                  placeholder={addToLibraryTranslations("watchedEpisodes", { max: maxEpisodes })}
                  variant={fieldState.invalid ? "invalid" : "default"}
                  disabled={maxEpisodes <= 1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="rating"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-foreground">{addToLibraryTranslations("rating")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  placeholder={addToLibraryTranslations("rating")}
                  variant={fieldState.invalid ? "invalid" : "default"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant={"secondary"} type="submit" disabled={isPending}>
          {isPending ? <Loader /> : addToLibraryTranslations(library ? "save" : "add")}
        </Button>
      </form>
    </Form>
  );
};

export default AddToLibraryForm;
