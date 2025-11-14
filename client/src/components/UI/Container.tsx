import { cn } from "@/lib/utils";
import { ReactElement } from "react";

type ContainerProps = {
  children: ReactElement;
  className?: string;
  [k: string]: any;
};

function Container({ children, className }: Readonly<ContainerProps>) {
  return <div className={cn("w-full mt-0 mx-auto xl:px-0 px-5 container h-full", className)}>{children}</div>;
}

export default Container;
