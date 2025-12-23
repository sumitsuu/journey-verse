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
    : "Enter an integer value";

export const minValue = (min: any) => (value: any) =>
  empty(value) || isNaN(value) || value >= min ? undefined : `Value must be greater than or equal to ${min}`;

export const maxValue = (max: any) => (value: any) =>
  empty(value) || isNaN(value) || value <= max ? undefined : `Value must be less than or equal to ${max}`;
