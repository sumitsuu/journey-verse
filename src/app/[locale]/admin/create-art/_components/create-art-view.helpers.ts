export const getErrorMessage = (error: unknown) => (typeof error === "string" ? error : undefined);
