import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { SelectComponent } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const ChangeDefaultUserType = () => {
  const form = useForm();

  const onSubmit = form.handleSubmit(async () => {
    const response = { id: 0 };
    if (response?.id) {
      return toast({
        title: "Type updated successfully.",
        variant: "success",
      });
    }
    return toast({
      title: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={"md:w-[20vw] w-full px-4 flex flex-col gap-3"}>
        <FormLabel>Change Default Library Type</FormLabel>
        <FormField
          control={form.control}
          defaultValue={""}
          name="type"
          render={({ field }) => (
            <SelectComponent
              options={[{ name: "placeholder", id: 0 }].map((item) => ({
                label: item.name,
                value: item.id.toString(),
              }))}
              onValueChange={field.onChange}
              value={field.value}
              placeholder={"Type"}
            />
          )}
        />
        <Button variant={"secondary"} type="submit">
          Update
        </Button>
      </form>
    </Form>
  );
};

export default ChangeDefaultUserType;
