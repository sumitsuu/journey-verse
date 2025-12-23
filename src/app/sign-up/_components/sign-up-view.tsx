"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input, PasswordInput } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { createUserAction } from "@/src/lib/actions";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

const SignUpSchema = z
  .object({
    password: z.string().min(3, "Password must be at least 3 characters long"),
    passwordRepeat: z.string().min(3, "Password must be at least 3 characters long"),
    displayName: z.string().min(1, "This field is required"),
    email: z.string().min(1, "This field is required").email("Invalid email address. Example: test@gmail.com"),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Passwords must match",
    path: ["passwordRepeat"],
  });

export type SignUpErrorType = "email" | "password" | "passwordRepeat";

const SignUpView = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      displayName: "",
      password: "",
      passwordRepeat: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (session?.expires) {
      router.push("/");
    }
  }, [session]);

  const renderErrors = Object.keys(form.formState?.errors).map((key: string) => {
    const error = form.formState.errors[key as SignUpErrorType];
    if (error) {
      return (
        <Alert key={key} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {key}: {error.message}
          </AlertDescription>
        </Alert>
      );
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof SignUpSchema>) => {
      await createUserAction(data);
    },
    onSuccess: () => {
      toast({
        title: "User created successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "An error occurred while creating the user",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    createUserMutation.mutate(data);
    signIn("credentials", {
      redirect: false,
      username: data.email,
      password: data.password,
    });
  };

  return (
    <>
      <div className={"flex items-center justify-center md:gap-10 gap-5 w-full"}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"w-full flex-col flex gap-5 max-w-[400px] px-4 md:px-0 self-start"}
          >
            <span className={"md:text-4xl text-3xl mb-4"}>Sign Up</span>
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Input variant={fieldState.invalid ? "invalid" : "default"} placeholder={"Email"} {...field} />
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field, fieldState }) => (
                <Input variant={fieldState.invalid ? "invalid" : "default"} placeholder={"Name"} {...field} />
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <PasswordInput
                  placeholder={"Password"}
                  variant={fieldState.invalid ? "invalid" : "default"}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="passwordRepeat"
              render={({ field, fieldState }) => (
                <PasswordInput
                  placeholder={"Repeat password"}
                  variant={fieldState.invalid ? "invalid" : "default"}
                  {...field}
                />
              )}
            />

            <Link href="/sign-in" className={"hover:text-light-purple-1 duration-300"}>
              Already have an account?
            </Link>
            <Button variant={"secondary"} type="submit" disabled={isPending}>
              {isPending ? <Loader /> : "Sign Up"}
            </Button>
            <p className="text-gray-400 text-center md:inline hidden">
              "The journey of a thousand miles begins with a single step."
            </p>
            {/* {form.formState?.errors && (
                    <div className={"flex flex-col gap-2"}>{renderErrors}</div>
                )} */}
          </form>
        </Form>

        <Image
          src="/images/logo-1.png"
          width={500}
          height={1000}
          className={
            "h-full max-h-[364px] rounded-[12px] w-full lg:max-w-[400px] md:max-w-[350px] max-w-full md:block hidden"
          }
          alt="Picture of the author"
        />
      </div>
      <div className={"flex flex-col items-center text-light-purple-1 gap-2 md:mt-10 mt-4"}>
        <span>or continue with</span>
        <div className={"grid md:grid-cols-6 grid-cols-3 gap-4"}>
          <Button>Google</Button>
          <Button>Yandex</Button>
          <Button>GitHub</Button>
          <Button>Facebook</Button>
          <Button>Twitter</Button>
          <Button>Steam</Button>
        </div>
      </div>
    </>
  );
};

export default SignUpView;
