import type { ReactNode } from "react";

type FieldBlockProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export const FieldBlock = ({ label, error, children }: FieldBlockProps) => {
  return (
    <label className={"block space-y-2"}>
      <span className={"text-sm font-semibold text-white"}>{label}</span>
      {children}
      {error && <span className={"block text-sm text-destructive"}>{error}</span>}
    </label>
  );
};
