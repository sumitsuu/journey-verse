"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AutocompleteProps<T extends string | number> = {
  placeholder: string;
  options: { value: T; label: string }[];
  multiple?: boolean;
  onChange: (value: T[]) => void;
  values: T[];
};

export function Autocomplete<T extends string | number>({
  placeholder,
  options,
  multiple = false,
  onChange,
  values,
}: AutocompleteProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role="combobox" aria-expanded={open} className="w-full justify-between">
          {values.length > 0
            ? multiple
              ? options
                  .filter(({ value }) => values.includes(value))
                  .map(({ label }) => label)
                  .join(", ")
              : options.find(({ value }) => values.includes(value))?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandList>
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={String(option.value)} // Приводим к строке, чтобы избежать конфликтов
                  onSelect={(currentValue) => {
                    const currentOption = options.find((item) => String(item.value) === currentValue);
                    if (!currentOption) return;

                    if (multiple) {
                      if (values.includes(currentOption.value)) {
                        onChange(values.filter((val) => val !== currentOption.value));
                      } else {
                        onChange([...values, currentOption.value]);
                      }
                    } else {
                      onChange([currentOption.value]);
                    }

                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", values.includes(option.value) ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
