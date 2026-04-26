"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createArtAction } from "@/src/lib/actions/art/create-art.action";
import type { Locale } from "@/src/lib/i18n/locales";
import type { FindCountriesOutput } from "@/src/lib/services/country/find-countries.service";
import type { FindGenresOutput } from "@/src/lib/services/genre/find-genres.service";
import type { FindStatusesOutput } from "@/src/lib/services/status/find-statuses.service";
import type { FindTypesOutput } from "@/src/lib/services/type/find-types.service";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { CalendarDays, Clapperboard, FileText, ImagePlus, Layers3, LibraryBig, Sparkles, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErrorMessage } from "./create-art-view.helpers";
import { FieldBlock } from "./field-block";
import { SectionHeader } from "./section-header";
import { SnapshotRow } from "./snapshot-row";

const createCreateArtSchema = (t: (key: string) => string) =>
  z.object({
    releaseDate: z.date({
      required_error: t("validation.releaseDateRequired"),
      invalid_type_error: t("validation.releaseDateRequired"),
    }),
    episodes: z.coerce.number().int(t("validation.episodesRequired")).min(1, t("validation.episodesRequired")),
    countryId: z.coerce.number().min(1, t("validation.countryRequired")),
    typeId: z.coerce.number().min(1, t("validation.mediaTypeRequired")),
    statusId: z.coerce.number().min(1, t("validation.statusRequired")),
    genres: z.array(z.coerce.number()).min(1, t("validation.genresRequired")),
    title: z.string().trim().min(1, t("validation.titleRequired")),
    description: z.string().trim().min(1, t("validation.descriptionRequired")),
    previewPath: z
      .any()
      .refine(
        (val) =>
          typeof FileList !== "undefined" &&
          val instanceof FileList &&
          val.length > 0 &&
          ["image/jpeg", "image/png", "image/jpg"].includes(val[0].type),
        { message: t("validation.previewImage") }
      ),
  });

type CreateArtFormValues = z.infer<ReturnType<typeof createCreateArtSchema>>;

type CreateArtViewProps = {
  countries: FindCountriesOutput[];
  types: FindTypesOutput[];
  statuses: FindStatusesOutput[];
  genres: FindGenresOutput[];
  locale: Locale;
};

export const CreateArtView = ({ countries, types, statuses, genres, locale }: CreateArtViewProps) => {
  const t = useTranslations("Admin.createArt");
  const fileInputId = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const createArtSchema = useMemo(() => createCreateArtSchema(t), [t]);

  const form = useForm<CreateArtFormValues>({
    resolver: zodResolver(createArtSchema),
    defaultValues: {
      releaseDate: new Date(),
      episodes: 1,
      countryId: countries[0]?.id ?? 0,
      typeId: types[0]?.id ?? 0,
      statusId: statuses[0]?.id ?? 0,
      genres: [],
      title: "",
      description: "",
      previewPath: undefined,
    },
    mode: "onChange",
  });
  const selectedPreview = form.watch("previewPath");
  const selectedGenres = form.watch("genres");
  const title = form.watch("title");
  const description = form.watch("description");

  useEffect(() => {
    const file = selectedPreview?.[0];

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [selectedPreview]);

  const createArtMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createArtAction(data);
    },
    onSuccess: () => {
      toast({
        title: t("messages.createdSuccess"),
        variant: "success",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: error.message || t("messages.createError"),
        variant: "destructive",
      });
    },
  });
  const isCreateDisabled = createArtMutation.isPending || !form.formState.isValid;

  const onSubmit = async (data: CreateArtFormValues) => {
    const formData = new FormData();
    formData.append("locale", locale);
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
    <div className={"w-full px-4 py-8 md:px-8 lg:px-12"}>
      <Form {...form}>
        <form className={"mx-auto flex w-full max-w-[1180px] flex-col gap-6"} onSubmit={form.handleSubmit(onSubmit)}>
          <div className={"flex flex-col gap-4 md:flex-row md:items-end md:justify-between"}>
            <div className={"space-y-2"}>
              <div
                className={
                  "inline-flex w-max items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
                }
              >
                <Sparkles className={"size-4"} />
                {t("badge")}
              </div>
              <div>
                <h1 className={"text-3xl font-bold text-white md:text-4xl"}>{t("title")}</h1>
                <p className={"mt-2 max-w-[620px] text-sm text-muted-foreground md:text-base"}>{t("description")}</p>
              </div>
            </div>

            <Button
              variant={"gradient"}
              size={"xl"}
              type={"submit"}
              disabled={isCreateDisabled}
              className={"w-full md:w-auto"}
            >
              {createArtMutation.isPending ? <Loader /> : <Upload className={"size-4"} />}
              {t("actions.create")}
            </Button>
          </div>

          <div className={"grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"}>
            <div className={"space-y-6"}>
              <section className={"rounded-lg border border-primary/15 bg-card/70 p-5 shadow-2xl shadow-black/20"}>
                <SectionHeader
                  icon={<FileText className={"size-5"} />}
                  title={t("sections.identity.title")}
                  description={t("sections.identity.description")}
                />

                <div className={"mt-5 grid gap-4"}>
                  <FormField
                    control={form.control}
                    name={"title"}
                    render={({ field }) => (
                      <FieldBlock label={t("fields.title.label")} error={form.formState.errors.title?.message}>
                        <Input
                          size={"lg"}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("fields.title.placeholder")}
                          className={"border-primary/20 bg-background/80"}
                        />
                      </FieldBlock>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={"description"}
                    render={({ field }) => (
                      <FieldBlock
                        label={t("fields.description.label")}
                        error={form.formState.errors.description?.message}
                      >
                        <Textarea
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("fields.description.placeholder")}
                          className={"min-h-[180px] border-primary/20 bg-background/80 leading-6"}
                        />
                      </FieldBlock>
                    )}
                  />
                </div>
              </section>

              <section className={"rounded-lg border border-primary/15 bg-card/70 p-5 shadow-2xl shadow-black/20"}>
                <SectionHeader
                  icon={<LibraryBig className={"size-5"} />}
                  title={t("sections.catalog.title")}
                  description={t("sections.catalog.description")}
                />

                <div className={"mt-5 grid gap-4 md:grid-cols-2"}>
                  <FormField
                    control={form.control}
                    name={"typeId"}
                    render={({ field }) => (
                      <FieldBlock label={t("fields.mediaType.label")} error={form.formState.errors.typeId?.message}>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <SelectTrigger size={"lg"} className={"border-primary/20 bg-background/80"}>
                            <SelectValue placeholder={t("fields.mediaType.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((item: FindTypesOutput) => (
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name || ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldBlock>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={"statusId"}
                    render={({ field }) => (
                      <FieldBlock label={t("fields.status.label")} error={form.formState.errors.statusId?.message}>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <SelectTrigger size={"lg"} className={"border-primary/20 bg-background/80"}>
                            <SelectValue placeholder={t("fields.status.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((item: FindStatusesOutput) => (
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name || ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldBlock>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={"countryId"}
                    render={({ field }) => (
                      <FieldBlock label={t("fields.country.label")} error={form.formState.errors.countryId?.message}>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <SelectTrigger size={"lg"} className={"border-primary/20 bg-background/80"}>
                            <SelectValue placeholder={t("fields.country.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((item: FindCountriesOutput) => (
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name || ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldBlock>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={"episodes"}
                    render={({ field }) => (
                      <FieldBlock label={t("fields.episodes.label")} error={form.formState.errors.episodes?.message}>
                        <Input
                          size={"lg"}
                          type={"number"}
                          min={1}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("fields.episodes.placeholder")}
                          className={"border-primary/20 bg-background/80"}
                        />
                      </FieldBlock>
                    )}
                  />

                  <div className={"md:col-span-2"}>
                    <FormField
                      control={form.control}
                      name={"genres"}
                      render={({ field }) => (
                        <FieldBlock
                          label={t("fields.genres.label")}
                          error={getErrorMessage(form.formState.errors.genres?.message)}
                        >
                          <MultiSelect
                            size={"lg"}
                            className={"border border-primary/20 bg-background/80"}
                            options={genres.map((item: FindGenresOutput) => ({
                              label: item.name || "",
                              value: item.id.toString(),
                            }))}
                            defaultValue={field.value?.map(String)}
                            onValueChange={(value) => field.onChange(value.map(Number))}
                            placeholder={t("fields.genres.placeholder")}
                          />
                        </FieldBlock>
                      )}
                    />
                  </div>
                </div>
              </section>
            </div>

            <aside className={"space-y-6"}>
              <section className={"rounded-lg border border-primary/15 bg-card/70 p-5 shadow-2xl shadow-black/20"}>
                <SectionHeader
                  icon={<ImagePlus className={"size-5"} />}
                  title={t("sections.artwork.title")}
                  description={t("sections.artwork.description")}
                />

                <FormField
                  control={form.control}
                  name={"previewPath"}
                  render={({ field }) => (
                    <FieldBlock
                      label={t("fields.previewImage.label")}
                      error={getErrorMessage(form.formState.errors.previewPath?.message)}
                    >
                      <input
                        id={fileInputId}
                        type={"file"}
                        accept={"image/jpeg,image/png,image/jpg"}
                        className={"hidden"}
                        onChange={(event) => field.onChange(event.target.files)}
                      />
                      <label
                        htmlFor={fileInputId}
                        className={
                          "mt-3 flex aspect-[2/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-primary/40 bg-background/80 text-center transition hover:border-secondary/80 hover:bg-background"
                        }
                      >
                        {previewUrl ? (
                          <img src={previewUrl} alt={""} className={"h-full w-full object-cover"} />
                        ) : (
                          <div className={"flex max-w-[220px] flex-col items-center gap-3 px-6"}>
                            <div className={"rounded-md bg-primary/15 p-3 text-primary"}>
                              <ImagePlus className={"size-8"} />
                            </div>
                            <div>
                              <p className={"font-semibold text-white"}>{t("upload.title")}</p>
                              <p className={"mt-1 text-sm text-muted-foreground"}>{t("upload.description")}</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </FieldBlock>
                  )}
                />
              </section>

              <section className={"rounded-lg border border-primary/15 bg-card/70 p-5 shadow-2xl shadow-black/20"}>
                <SectionHeader
                  icon={<CalendarDays className={"size-5"} />}
                  title={t("sections.release.title")}
                  description={t("sections.release.description")}
                />

                <div className={"mt-5"}>
                  <FormField
                    control={form.control}
                    name={"releaseDate"}
                    render={({ field }) => (
                      <FieldBlock
                        label={t("fields.releaseDate.label")}
                        error={form.formState.errors.releaseDate?.message}
                      >
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          size={"lg"}
                          placeholder={t("fields.releaseDate.placeholder")}
                        />
                      </FieldBlock>
                    )}
                  />
                </div>
              </section>

              <section className={"rounded-lg border border-primary/15 bg-card/70 p-5 shadow-2xl shadow-black/20"}>
                <SectionHeader
                  icon={<Layers3 className={"size-5"} />}
                  title={t("sections.snapshot.title")}
                  description={t("sections.snapshot.description")}
                />

                <div className={"mt-5 space-y-3 text-sm"}>
                  <SnapshotRow label={t("snapshot.title")} value={title || t("snapshot.untitled")} />
                  <SnapshotRow
                    label={t("snapshot.description")}
                    value={t("snapshot.characters", { count: description.length })}
                  />
                  <SnapshotRow
                    label={t("snapshot.genres")}
                    value={t("snapshot.selectedGenres", { count: selectedGenres.length })}
                  />
                  <SnapshotRow label={t("snapshot.locale")} value={locale.toUpperCase()} />
                </div>
              </section>
            </aside>
          </div>

          <div
            className={
              "sticky bottom-4 flex flex-col gap-3 rounded-lg border border-primary/20 bg-background/95 p-3 shadow-2xl shadow-black/40 backdrop-blur md:flex-row md:items-center md:justify-between"
            }
          >
            <div className={"flex items-center gap-3 text-sm text-muted-foreground"}>
              <div className={"rounded-md bg-secondary/15 p-2 text-secondary"}>
                <Clapperboard className={"size-4"} />
              </div>
              <span>{t("footerNote")}</span>
            </div>
            <Button variant={"gradient"} type={"submit"} disabled={isCreateDisabled}>
              {createArtMutation.isPending ? <Loader /> : <Upload className={"size-4"} />}
              {t("actions.create")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
