"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { userRequests } from "@/src/http-requests/user-requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import z from "zod";

const validationSchema = z.object({
  oldPassword: z.string().min(3, "Пароль должен состоять минимум из 3-х символов"),
  newPassword: z.string().min(3, "Пароль должен состоять минимум из 3-х символов"),
});
const ChangePassword = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await userRequests.updateUserPassword({
      ...data,
      id: Number(user?.id),
    });
    if (response && response.status === 200) {
      toast({
        title: "Пароль успешно обновлён",
        variant: "success",
      });
      return form.reset();
    }
    return toast({
      title: "Что-то пошло не так. Попробуйте снова.",
      variant: "destructive",
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={"md:w-[20vw] w-full px-4 flex flex-col gap-3"}>
        <FormLabel>Изменение пароля</FormLabel>
        <FormField
          control={form.control}
          name="oldPassword"
          defaultValue=""
          render={({ field: { ref, ...rest }, fieldState }) => (
            <Input
              {...rest}
              placeholder={"Старый пароль"}
              type="password"
              variant={fieldState.invalid ? "invalid" : "default"}
            />
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          defaultValue=""
          render={({ field: { ref, ...rest }, fieldState }) => (
            <Input
              {...rest}
              placeholder={"Новый пароль"}
              type="password"
              variant={fieldState.invalid ? "invalid" : "default"}
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

export default ChangePassword;
