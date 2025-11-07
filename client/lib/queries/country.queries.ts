import { queryOptions } from "@tanstack/react-query";
import countryRequests from "../../src/http-requests/country-requests";

export const CountryQueries = {
  getCountries: () => {
    return queryOptions({
      queryKey: ["getCountries"],
      queryFn: async () => await countryRequests.getCountries(),
    });
  },
};
