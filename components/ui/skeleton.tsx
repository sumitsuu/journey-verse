import { cn } from "@/lib/utils";

import React from "react";

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />;
};

export { Skeleton };
