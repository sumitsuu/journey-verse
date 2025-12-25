"use server";

import { z } from "zod";

import { DEFAULT_LOCALE } from "../../i18n/locales";
import { createArts } from "../../services/art/create-art";

const createArtSchema = z.object({
  locale: z.enum(["en", "ru"]).optional(),
  releaseDate: z.string().transform((str) => new Date(str)),
  countryId: z.coerce.number().int().positive(),
  typeId: z.coerce.number().int().positive(),
  statusId: z.coerce.number().int().positive(),
  episodes: z.coerce.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  genres: z
    .string()
    .optional()
    .transform((str) => (str ? str.split(",").map(Number).filter(Boolean) : undefined)),
  previewFile: z.instanceof(File).optional(),
});

// TODO: refactor this action!!!!!!

export async function createArtAction(
  formData: FormData
): Promise<{ success: true; data: { id: number } } | { success: false; error: string }> {
  try {
    const locale = formData.get("locale");
    const releaseDate = formData.get("releaseDate") as string;
    const countryId = formData.get("countryId") as string;
    const typeId = formData.get("typeId") as string;
    const statusId = formData.get("statusId") as string;
    const episodes = formData.get("episodes") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const genres = formData.get("genres[]") as string | null;
    const previewFile = formData.get("previewPath") as File | null;

    const validated = createArtSchema.parse({
      locale,
      releaseDate,
      countryId,
      typeId,
      statusId,
      episodes,
      title,
      description,
      genres: genres || undefined,
      previewFile: previewFile || undefined,
    });

    let previewFileData: { buffer: Buffer; originalname: string } | undefined;

    if (validated.previewFile) {
      const arrayBuffer = await validated.previewFile.arrayBuffer();
      previewFileData = {
        buffer: Buffer.from(arrayBuffer),
        originalname: validated.previewFile.name,
      };
    }

    if (!previewFileData) {
      return { success: false, error: "Preview file is required" };
    }

    const result = await createArts(validated.locale || DEFAULT_LOCALE, previewFileData, {
      releaseDate: validated.releaseDate,
      countryId: validated.countryId,
      typeId: validated.typeId,
      statusId: validated.statusId,
      episodes: validated.episodes,
      title: validated.title,
      description: validated.description,
      genres: validated.genres,
    });

    return { success: true, data: { id: result.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create art",
    };
  }
}
