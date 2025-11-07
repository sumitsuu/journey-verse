import { Button } from "@/components/ui/button";
import { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { Form, FormField, FormLabel } from "@/components/ui/form";
import { FileInput } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { userRequests } from "@/src/http-requests/user-requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

const validationSchema = z.object({
  avatar: z.any().refine((file) => file instanceof File, {
    message: "Поле не должно быть пустым",
  }),
});

const ChangeAvatar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const form = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onSubmit",
  });
  const onSubmit = form.handleSubmit(async ({ avatar }: any) => {
    const formData = new FormData();
    formData.append("file", avatar);
    const path = await userRequests.updateUserAvatar(formData, Number(user?.id));

    if (path) {
      return toast({
        title: "Аватар успешно обновлён.",
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
        <FormLabel>Изменение аватара</FormLabel>
        <FormField
          name="avatar"
          control={form.control}
          render={({ field: { ref, onChange, ...rest }, fieldState }) => (
            <FileInput
              placeholder={"Аватар"}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  return onChange({
                    target: {
                      value: e.target.files[0],
                      name: rest.name,
                    },
                  });
                }
              }}
              variant={fieldState.invalid ? "invalid" : "default"}
              type="file"
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

export default ChangeAvatar;
