import { queryOptions } from "@tanstack/react-query";
import genreRequests from "../../src/http-requests/genre-requests";

export const GenreQueries = {
  getGenres: () => {
    return queryOptions({
      queryKey: ["getGenres"],
      queryFn: async () => await genreRequests.getGenres(),
    });
  },
};
