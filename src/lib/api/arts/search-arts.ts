import type { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";

type SearchArtsResponse = {
  items: FindArtsOutput[];
};

type SearchArtsInput = {
  locale: string;
  query: string;
  limit: number;
};

export async function searchArts({ locale, query, limit }: SearchArtsInput) {
  const params = new URLSearchParams({
    locale,
    q: query,
    limit: limit.toString(),
  });

  const response = await fetch(`/api/arts/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to search arts");
  }

  const data: SearchArtsResponse = await response.json();

  return data.items;
}
