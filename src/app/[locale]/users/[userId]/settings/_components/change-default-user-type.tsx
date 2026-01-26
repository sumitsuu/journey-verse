import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

const ChangeDefaultUserType = () => {
  const settingsTranslations = useTranslations("Settings");
  const commonTranslations = useTranslations("Common");
  const form = useForm();

  const onSubmit = form.handleSubmit(async () => {
    const response = { id: 0 };
    if (response?.id) {
      form.reset();
      return toast({
        title: settingsTranslations("typeUpdatedSuccess"),
        variant: "success",
      });
    }
    return toast({
      title: commonTranslations("error"),
      variant: "destructive",
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={"md:w-[20vw] w-full px-4 flex flex-col gap-3"}>
        <FormLabel>{settingsTranslations("changeDefaultLibraryType")}</FormLabel>
        <FormField
          control={form.control}
          defaultValue={""}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={settingsTranslations("selectType")} />
              </SelectTrigger>
              <SelectContent>
                {[{ name: "placeholder", id: 0 }].map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Button variant={"secondary"} type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? settingsTranslations("updating") : settingsTranslations("update")}
        </Button>
      </form>
    </Form>
  );
};

export default ChangeDefaultUserType;
