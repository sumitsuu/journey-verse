"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { updateUserAction } from "@/src/lib/actions/user/update-user.action";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";

const createValidationSchema = (passwordMinLengthMessage: string) =>
  z.object({
    oldPassword: z.string().min(3, passwordMinLengthMessage),
    newPassword: z.string().min(3, passwordMinLengthMessage),
  });

type ChangePasswordFormData = z.infer<ReturnType<typeof createValidationSchema>>;

const ChangePassword = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const settingsTranslations = useTranslations("Settings");
  const authValidationTranslations = useTranslations("Auth.validation");

  const validationSchema = createValidationSchema(authValidationTranslations("passwordMinLength"));
  const form = useForm<ChangePasswordFormData>({
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
      form.reset();
      toast({
        title: settingsTranslations("passwordUpdatedSuccess"),
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: settingsTranslations("userNotFound"),
        variant: "destructive",
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
        <FormLabel>{settingsTranslations("changePassword")}</FormLabel>
        <FormField
          control={form.control}
          name="oldPassword"
          defaultValue=""
          render={({ field: { ref, ...rest }, fieldState }) => (
            <Input
              {...rest}
              placeholder={settingsTranslations("oldPassword")}
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
              placeholder={settingsTranslations("newPassword")}
              type="password"
              variant={fieldState.invalid ? "invalid" : "default"}
            />
          )}
        />
        <Button variant={"secondary"} type="submit" disabled={updateUserPasswordMutation.isPending}>
          {updateUserPasswordMutation.isPending ? settingsTranslations("updating") : settingsTranslations("update")}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePassword;
