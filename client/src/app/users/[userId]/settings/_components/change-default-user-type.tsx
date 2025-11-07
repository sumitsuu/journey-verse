import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { SelectComponent } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const ChangeDefaultUserType = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const form = useForm();

  const onSubmit = form.handleSubmit(async ({ type }) => {
    const response = { id: 0 };
    if (response?.id) {
      return toast({
        title: "Тип успешно изменен.",
        variant: "success",
      });
    }
    return toast({
      title: "Что-то пошло не так. Попробуйте снова.",
      variant: "destructive",
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={"md:w-[20vw] w-full px-4 flex flex-col gap-3"}>
        <FormLabel>Изменить стандартный тип библиотеки </FormLabel>
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
              placeholder={"Тип"}
            />
          )}
        />
        <Button variant={"secondary"} type="submit">
          Изменить
        </Button>
      </form>
    </Form>
  );
};

export default ChangeDefaultUserType;
