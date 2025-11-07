export const HEADER_HEIGHT = "80px";
export const DEFAULT_MARGIN_TOP = "40px";
export const HEADER_BORDER_HEIGHT = "1px";

export const USER_LIB_ROWS_MOVIES = [
  { name: "Название", type: "text", key: "title" },
  { name: "Оценка", type: "input", key: "rating" },
];

export const USER_LIB_ROWS_ANIME = [
  { name: "Название", type: "text", key: "title" },
  { name: "Кол-во эпизодов", type: "input", key: "episodes" },
  { name: "Оценка", type: "input", key: "rating" },
];

export const USER_LIB_ROWS_SERIES = [
  { name: "Название", type: "text", key: "title" },
  { name: "Кол-во эпизодов", type: "input", key: "episodes" },
  { name: "Оценка", type: "input", key: "rating" },
];

export const USER_LIB_ROWS: any = {
  5: USER_LIB_ROWS_MOVIES,
  6: USER_LIB_ROWS_ANIME,
  7: USER_LIB_ROWS_SERIES,
  8: USER_LIB_ROWS_SERIES,
};
