export const composeValidators =
  (...validators: any) =>
  (value: any, allValues: any) =>
    validators.reduce((error: string, validator: any) => error || validator(value, allValues), undefined);

export const validateEmail = (value: string) =>
  /\S+@\S+\.\S+/.test(value) ? undefined : "Email you've inserted is incorrect";

export const required = (value: string | boolean) => {
  return value || value === false ? undefined : "This field is required";
};

const empty = (value: any) => value === undefined || value === null;

export const decimalNumber = (value: any) =>
  empty(value) || typeof value === "number" || value.match(/^[+-]?\d+(\.\d*)?$/g)
    ? undefined
    : "Введите целочисленное значение";

export const minValue = (min: any) => (value: any) =>
  empty(value) || isNaN(value) || value >= min ? undefined : `Введите значение которое равно или больше чем ${min}`; // `Should be greater or equal to ${min}`;

export const maxValue = (max: any) => (value: any) =>
  empty(value) || isNaN(value) || value <= max ? undefined : `Введите значение которое равно или меньше чем ${max}`; // `Should be less or equal to ${min}`;
