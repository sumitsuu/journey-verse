import type { ReactNode } from "react";

type SectionHeaderProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export const SectionHeader = ({ icon, title, description }: SectionHeaderProps) => {
  return (
    <div className={"flex gap-3"}>
      <div className={"flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary"}>
        {icon}
      </div>
      <div>
        <h2 className={"text-lg font-semibold text-white"}>{title}</h2>
        <p className={"mt-1 text-sm text-muted-foreground"}>{description}</p>
      </div>
    </div>
  );
};
