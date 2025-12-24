"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { updateUserAction } from "@/src/lib/actions/user/update-user";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import z from "zod";

const validationSchema = z.object({
  oldPassword: z.string().min(3, "Password must be at least 3 characters long"),
  newPassword: z.string().min(3, "Password must be at least 3 characters long"),
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

  const updateUserPasswordMutation = useMutation({
    mutationFn: async (data: { id: number; oldPassword: string; newPassword: string }) => {
      await updateUserAction({
        id: Number(user?.id),
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      toast({
        title: "Password updated successfully",
        variant: "success",
      });
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    updateUserPasswordMutation.mutate({
      id: Number(user?.id),
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={"md:w-[20vw] w-full px-4 flex flex-col gap-3"}>
        <FormLabel>Change Password</FormLabel>
        <FormField
          control={form.control}
          name="oldPassword"
          defaultValue=""
          render={({ field: { ref, ...rest }, fieldState }) => (
            <Input
              {...rest}
              placeholder={"Old password"}
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
              placeholder={"New password"}
              type="password"
              variant={fieldState.invalid ? "invalid" : "default"}
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

export default ChangePassword;
