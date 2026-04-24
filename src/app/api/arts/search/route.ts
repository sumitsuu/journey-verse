import { localesEnum } from "@/src/lib/db/schema";
import { findArts } from "@/src/lib/services/art/find-arts.service";
import { NextResponse } from "next/server";
import z from "zod";

const SearchArtsQuerySchema = z.object({
  locale: z.enum(localesEnum.enumValues),
  q: z.string().trim().min(1).max(100),
  limit: z.coerce.number().int().positive().max(12).default(6),
});

export async function GET(request: Request) {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);
  const parsedQuery = SearchArtsQuerySchema.safeParse(searchParams);

  if (!parsedQuery.success) {
    return NextResponse.json({ items: [] }, { status: 400 });
  }

  const { locale, q, limit } = parsedQuery.data;
  const items = await findArts({
    locale,
    filters: {
      search: q,
    },
    limit,
  });

  return NextResponse.json({ items });
}
