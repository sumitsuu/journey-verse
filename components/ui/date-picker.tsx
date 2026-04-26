"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DatePickerProps = {
  placeholder: string;
  value: Date;
  onChange: (value: Date | undefined) => void;
  size?: "sm" | "md" | "lg";
};

export const DatePicker = ({ placeholder, value, onChange, size = "md" }: DatePickerProps) => {
  const buttonSize = size === "md" ? "default" : size;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={buttonSize}
          className={
            "w-full justify-start gap-0 border-input bg-input-background text-muted-foreground hover:bg-input/50 hover:text-foreground"
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="w-auto overflow-hidden p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
