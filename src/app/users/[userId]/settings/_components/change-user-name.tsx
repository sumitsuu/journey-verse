"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { updateUserAction } from "@/src/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const validationSchema = z.object({
  name: z.string().min(3, "Display name must be at least 3 characters long"),
});

const ChangeUserName = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const form = useForm<z.infer<typeof validationSchema>>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: { id: number; displayName: string }) => {
      const result = await updateUserAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Display name updated successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!user?.id) {
      return toast({
        title: "User ID is required",
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
        <FormLabel>Change Display Name</FormLabel>
        <FormField
          control={form.control}
          name="name"
          defaultValue=""
          render={({ field, fieldState }) => (
            <Input {...field} placeholder={"New name"} variant={fieldState.invalid ? "invalid" : "default"} />
          )}
        />
        <Button variant={"secondary"} type="submit" disabled={updateUserMutation.isPending}>
          {updateUserMutation.isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default ChangeUserName;
