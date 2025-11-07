import { queryOptions } from "@tanstack/react-query";
import artsRequests from "../../src/http-requests/arts-requests";

export const ArtsQueries = {
  getArts: (typeId: number, sortOptions: Record<string, string>) => {
    return queryOptions({
      queryKey: ["getArts", typeId, sortOptions],
      queryFn: async () => await artsRequests.getArts(typeId, sortOptions),
    });
  },
  getSortOptions: (typeId: number) => {
    return queryOptions({
      queryKey: ["getSortOptions", typeId],
      queryFn: async () => await artsRequests.getSortOptions(typeId),
    });
  },
};
