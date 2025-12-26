import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

import { Form, FormField, FormLabel } from "@/components/ui/form";
import { FileInput } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { uploadFileAction } from "@/src/lib/actions/storage/upload-file.action";
import { updateUserAction } from "@/src/lib/actions/user/update-user.action";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { z } from "zod";

const createValidationSchema = (fileRequiredMessage: string) =>
  z.object({
    avatar: z.instanceof(File).refine((file) => file.size > 0, fileRequiredMessage),
  });

type FormData = z.infer<ReturnType<typeof createValidationSchema>>;

const ChangeAvatar = () => {
  const settingsTranslations = useTranslations("Settings");
  const commonTranslations = useTranslations("Common");

  const validationSchema = createValidationSchema(settingsTranslations("fileRequired"));

  const { data: session, update: updateSession } = useSession();
  const user = session?.user;
  const form = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    mode: "onSubmit",
  });

  const updateUserAvatarMutation = useMutation({
    mutationFn: async (data: { id: number; avatar: File }) => {
      const formData = new FormData();
      formData.append("file", data.avatar);
      formData.append("pathPrefix", `users/${data.id}`);

      const uploadResult = await uploadFileAction(formData);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      return await updateUserAction({
        id: data.id,
        avatarPath: uploadResult.publicUrl,
      });
    },
    onSuccess: async (result) => {
      if (session?.user) {
        await updateSession({
          user: {
            ...session.user,
            image: result.avatarPath || undefined,
          },
        });
      }
      toast({
        title: settingsTranslations("avatarUpdatedSuccess"),
        variant: "success",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: commonTranslations("error"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit(async ({ avatar }: FormData) => {
    if (!user?.id) {
      toast({
        title: settingsTranslations("userNotFound"),
        variant: "destructive",
      });
      return;
    }

    updateUserAvatarMutation.mutate({
      id: Number(user.id),
      avatar,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={"md:w-[20vw] w-full px-4 flex flex-col gap-3"}>
        <FormLabel>{settingsTranslations("changeAvatar")}</FormLabel>
        <FormField
          name="avatar"
          control={form.control}
          render={({ field: { ref, onChange, value, ...rest }, fieldState }) => (
            <FileInput
              placeholder={settingsTranslations("avatar")}
              ref={ref}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange(file);
                }
              }}
              variant={fieldState.invalid ? "invalid" : "default"}
              type="file"
              accept="image/*"
            />
          )}
        />
        <Button variant={"secondary"} type="submit" disabled={updateUserAvatarMutation.isPending}>
          {updateUserAvatarMutation.isPending ? settingsTranslations("updating") : settingsTranslations("update")}
        </Button>
      </form>
    </Form>
  );
};

export default ChangeAvatar;
