"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { updateUserAction } from "@/src/lib/actions/user/update-user";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createValidationSchema = (minLengthMessage: string) =>
  z.object({
    name: z.string().min(3, minLengthMessage),
  });

type ChangeUserNameFormData = z.infer<ReturnType<typeof createValidationSchema>>;

const ChangeUserName = () => {
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;
  const settingsTranslations = useTranslations("Settings");
  const commonTranslations = useTranslations("Common");

  const validationSchema = createValidationSchema(settingsTranslations("displayNameMinLength"));

  const form = useForm<ChangeUserNameFormData>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: { id: number; displayName: string }) => {
      return await updateUserAction(data);
    },
    onSuccess: async (result) => {
      if (session?.user) {
        await updateSession({
          user: {
            ...session.user,
            displayName: result.displayName,
          },
        });
      }
      form.reset();
      toast({
        title: settingsTranslations("displayNameUpdatedSuccess"),
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: commonTranslations("error"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!user?.id) {
      return toast({
        title: settingsTranslations("userIdRequired"),
        variant: "destructive",
      });
    }

    updateUserMutation.mutate({
      id: Number(user.id),
      displayName: data.name,
    });
  });
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={"md:w-[20vw] w-full px-4 flex flex-col gap-3"}>
        <FormLabel>{settingsTranslations("changeDisplayName")}</FormLabel>
        <FormField
          control={form.control}
          name="name"
          defaultValue=""
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder={settingsTranslations("newName")}
              variant={fieldState.invalid ? "invalid" : "default"}
            />
          )}
        />
        <Button variant={"secondary"} type="submit" disabled={updateUserMutation.isPending}>
          {updateUserMutation.isPending ? settingsTranslations("updating") : settingsTranslations("update")}
        </Button>
      </form>
    </Form>
  );
};

export default ChangeUserName;
