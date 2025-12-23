const dateOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};
export default (value: any, locale: any) => {
  return new Intl.DateTimeFormat(locale, dateOptions).format(new Date(value));
};
