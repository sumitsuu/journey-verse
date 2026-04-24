import { cn } from "@/lib/utils";

type StatContainerProps = {
  title: string;
  subtitle: string;
  className?: string;
};

export const StatContainer = ({ title, subtitle, className }: StatContainerProps) => {
  return (
    <div
      className={cn("bg-card rounded-lg flex flex-col justify-center items-center w-full h-24 text-center", className)}
    >
      <div className="text-white text-lg font-bold">{title}</div>
      <div className="text-sm text-gray-400">{subtitle}</div>
    </div>
  );
};
