import { queryOptions } from "@tanstack/react-query";
import statusRequests from "../../src/http-requests/status-requests";

export const StatusQueries = {
  getStatuses: () => {
    return queryOptions({
      queryKey: ["getStatuses"],
      queryFn: async () => await statusRequests.getStatuses(),
    });
  },
};
