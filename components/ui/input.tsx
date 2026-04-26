"use client";

import * as React from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FieldSize = "sm" | "md" | "lg";
type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  variant?: "default" | "invalid";
  size?: FieldSize;
};

const inputSizeClasses: Record<FieldSize, string> = {
  sm: "h-8 px-3 py-1 text-sm",
  md: "h-9 px-4 py-2 text-base md:text-sm",
  lg: "h-11 px-4 py-3 text-base md:text-sm",
};

const Input = ({ className, size = "md", type, variant, ...props }: InputProps) => {
  return (
    <input
      type={type}
      data-slot="input"
      aria-invalid={variant === "invalid"}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        inputSizeClasses[size],
        "focus:outline-none focus-visible:outline-none focus-visible:border-ring focus-visible:ring-0",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
};

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled = props.value === "" || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        variant={variant}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">{showPassword ? "Спрятать пароль" : "Показать пароль"}</span>
      </Button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

const FileInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onChange, variant, size = "md", ...props }, ref) => {
    const [fileName, setFileName] = React.useState<string | null>(null);
    const settingsTranslations = useTranslations("Settings");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setFileName(event.target.files[0].name);
      } else {
        setFileName(null);
      }
      if (onChange) {
        onChange(event);
      }
    };

    return (
      <div className="relative">
        <input type="file" ref={ref} {...props} className="hidden" onChange={handleFileChange} id="file-upload" />
        <label
          htmlFor="file-upload"
          aria-invalid={variant === "invalid"}
          className={cn(
            "flex w-full min-w-0 rounded-md border border-input bg-input-background cursor-pointer transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            inputSizeClasses[size],
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            variant === "invalid" && "ring-destructive/20 dark:ring-destructive/40 border-destructive",
            className
          )}
        >
          {fileName || settingsTranslations("uploadFile")}
        </label>
      </div>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput, Input, PasswordInput };
