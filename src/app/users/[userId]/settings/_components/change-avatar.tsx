import { Button } from "@/components/ui/button";
import { ChangeEvent } from "react";

import { useForm } from "react-hook-form";

import { Form, FormField, FormLabel } from "@/components/ui/form";
import { FileInput } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { updateUserAction } from "@/src/lib/actions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { z } from "zod";

const validationSchema = z.object({
  avatar: z.any().refine((file) => file instanceof File, {
    message: "This field cannot be empty",
  }),
});

const ChangeAvatar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const form = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onSubmit",
  });

  const updateUserAvatarMutation = useMutation({
    mutationFn: async (data: { id: number; avatar: File }) => {
      await updateUserAction(data);
    },
    onSuccess: () => {
      toast({
        title: "Avatar updated successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  const onSubmit = form.handleSubmit(async ({ avatar }: any) => {
    updateUserAvatarMutation.mutate({
      id: Number(user?.id),
      avatar: avatar as File,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={"md:w-[20vw] w-full px-4 flex flex-col gap-3"}>
        <FormLabel>Change Avatar</FormLabel>
        <FormField
          name="avatar"
          control={form.control}
          render={({ field: { ref, onChange, ...rest }, fieldState }) => (
            <FileInput
              placeholder={"Avatar"}
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
          Update
        </Button>
      </form>
    </Form>
  );
};

export default ChangeAvatar;
