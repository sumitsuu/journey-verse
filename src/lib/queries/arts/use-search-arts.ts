import { searchArts } from "@/src/lib/api/arts/search-arts";
import { useQuery } from "@tanstack/react-query";

type UseSearchArtsInput = {
  locale: string;
  query: string;
  limit: number;
};

export function useSearchArts({ locale, query, limit }: UseSearchArtsInput) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["arts-search", locale, normalizedQuery, limit],
    queryFn: () => searchArts({ locale, query: normalizedQuery, limit }),
    enabled: normalizedQuery.length > 0,
  });
}
