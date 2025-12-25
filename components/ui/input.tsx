import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { InputHTMLAttributes, ReactNode } from "react";

const inputVariants = cva(
  `block flex h-9 w-full bg-transparent py-1 text-base transition-colors file:bg-black-2 
   file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none outline-none disabled:cursor-not-allowed
   disabled:opacity-50 md:text-sm relative`,
  {
    variants: {
      variant: {
        default: "",
        invalid: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const inputWrapperVariants = cva(
  "flex items-center justify-center rounded-[12px] w-full px-4 gap-2 bg-black-2 !text-light-purple-1 hover:bg-black-3 duration-300 input-wrapper border-transparent border-[1px]",
  {
    variants: {
      variant: {
        default: "",
        invalid: "border border-[1px] border-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CustomInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  variant?: "default" | "invalid";
  className?: {
    wrapper?: string;
    input?: string;
  };
}

const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className = { wrapper: "", input: "" }, type, variant, endAdornment, startAdornment, ...props }, ref) => {
    return (
      <div className={`${cn(inputWrapperVariants({ variant, className: className.wrapper }))}`}>
        {startAdornment}
        <input
          type={type}
          className={cn(inputVariants({ variant, className: className.input }))}
          ref={ref}
          {...props}
        />
        {endAdornment}
      </div>
    );
  }
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, CustomInputProps>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled = props.value === "" || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={{
          input: cn("hide-password-toggle pr-10", className?.input),
        }}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="compact"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-light-purple-1 text-light-purple-1"
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

const FileInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className = { wrapper: "", input: "" }, variant, onChange, ...props }, ref) => {
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
      <div className={`${cn(inputWrapperVariants({ variant, className: className.wrapper }))}`}>
        <input type="file" ref={ref} {...props} className="hidden" onChange={handleFileChange} id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 text-white">
          {fileName || settingsTranslations("uploadFile")}
        </label>
      </div>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput, Input, PasswordInput };
