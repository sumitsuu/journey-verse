import { queryOptions } from "@tanstack/react-query";
import typesRequests from "../../src/http-requests/types-requests";

export const TypeQueries = {
  getTypes: () => {
    return queryOptions({
      queryKey: ["getTypes"],
      queryFn: async () => await typesRequests.getTypes(),
    });
  },
};
