import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { userRequests } from "@/src/http-requests/user-requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

const validationSchema = z.object({
  name: z.string().min(3, "Имя пользователя должно состоять минимум из 3-х символов"),
});

const ChangeUserName = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const form = useForm<z.infer<typeof validationSchema>>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
  });
  const onSubmit = form.handleSubmit(async (data) => {
    const response = await userRequests.updateUserName({
      name: data.name,
      id: Number(user?.id),
    });
    if (response?.data?.name) {
      form.reset();
      return toast({
        title: "Имя успешно изменено.",
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
        <FormLabel>Изменение имени пользователя</FormLabel>
        <FormField
          control={form.control}
          name="name"
          defaultValue=""
          render={({ field, fieldState }) => (
            <Input {...field} placeholder={"Новое имя"} variant={fieldState.invalid ? "invalid" : "default"} />
          )}
        />
        <Button variant={"secondary"} type="submit">
          Изменить
        </Button>
      </form>
    </Form>
  );
};

export default ChangeUserName;
