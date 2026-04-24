"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const Overlay = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="overlay"
      className={cn(
        "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
};

export { Overlay };
