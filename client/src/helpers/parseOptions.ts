import { Genre } from "../types/models/genre.types";
import { Status } from "../types/models/status.types";

export const parseMultipleOptions = (type: string, arr: Genre[] | Status[], parsed: string | (string | null)[]) => {
  let result;
  if (Array.isArray(parsed)) {
    result = arr.filter((item) => {
      return parsed.some((f) => {
        return Number(f) === item.id;
      });
    });
  } else {
    result = arr.filter((item) => {
      return item.id === Number(parsed);
    });
  }
  return result;
};

export const parseSingleOptions = (
  type: string,
  arr: { id?: number; name: string }[],
  parsed: string | (string | null)[]
) => {
  const result = arr.filter((item) => {
    if (item.id) {
      return item.id === Number(parsed);
    }
    return item.name === parsed;
  })[0];
  return result || null;
};
