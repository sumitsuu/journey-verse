"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Link, useRouter } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

import { Input, PasswordInput } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { createUserAction } from "@/src/lib/actions/user/create-user.action";
import { CreateUserOutput } from "@/src/lib/services/user/create-user.service";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

const createSignUpSchema = (validationTranslations: (key: string) => string) =>
  z
    .object({
      password: z.string().min(3, validationTranslations("passwordMinLength")),
      passwordRepeat: z.string().min(3, validationTranslations("passwordMinLength")),
      displayName: z.string().min(1, validationTranslations("fieldRequired")),
      email: z.string().min(1, validationTranslations("fieldRequired")).email(validationTranslations("emailInvalid")),
    })
    .refine((data) => data.password === data.passwordRepeat, {
      message: validationTranslations("passwordsMustMatch"),
      path: ["passwordRepeat"],
    });

export type SignUpErrorType = "email" | "password" | "passwordRepeat";

const SignUpView = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const commonTranslations = useTranslations("Common");
  const signUpTranslations = useTranslations("Auth.signUp");
  const validationTranslations = useTranslations("Auth.validation");
  const authMessagesTranslations = useTranslations("Auth.messages");
  const SignUpSchema = createSignUpSchema(validationTranslations);

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

  const password = form.watch("password");

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
          <AlertTitle>{commonTranslations("error")}</AlertTitle>
          <AlertDescription>
            {key}: {error.message}
          </AlertDescription>
        </Alert>
      );
    }
  });

  const createUserMutation = useMutation<CreateUserOutput, unknown, z.infer<typeof SignUpSchema>>({
    mutationFn: async (data) => {
      return await createUserAction(data);
    },
    onSuccess: (data: CreateUserOutput) => {
      toast({
        title: authMessagesTranslations("userCreatedSuccess"),
        variant: "success",
      });
      signIn("credentials", {
        redirect: false,
        username: data.email,
        password,
      });
    },
    onError: () => {
      toast({
        title: authMessagesTranslations("userCreationError"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    createUserMutation.mutate(data);
  };

  return (
    <>
      <div className={"flex items-center justify-center md:gap-10 gap-5 w-full"}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"w-full flex-col flex gap-5 max-w-[400px] px-4 md:px-0 self-start"}
          >
            <span className={"md:text-4xl text-3xl mb-4"}>{signUpTranslations("title")}</span>
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  variant={fieldState.invalid ? "invalid" : "default"}
                  placeholder={signUpTranslations("email")}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field, fieldState }) => (
                <Input
                  variant={fieldState.invalid ? "invalid" : "default"}
                  placeholder={signUpTranslations("name")}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <PasswordInput
                  placeholder={signUpTranslations("password")}
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
                  placeholder={signUpTranslations("repeatPassword")}
                  variant={fieldState.invalid ? "invalid" : "default"}
                  {...field}
                />
              )}
            />

            <Link href="/sign-in" className={"hover:text-light-purple-1 duration-300"}>
              {signUpTranslations("hasAccount")}
            </Link>
            <Button variant={"secondary"} type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? <Loader /> : signUpTranslations("submit")}
            </Button>
            <p className="text-gray-400 text-center md:inline hidden">
              &quot;{signUpTranslations("inspirationQuote")}&quot;
            </p>
            {form.formState?.errors && <div className={"flex flex-col gap-2"}>{renderErrors}</div>}
          </form>
        </Form>

        <Image
          src="/images/logo-1.png?v=2"
          width={500}
          height={1000}
          className={
            "h-full max-h-[364px] rounded-[12px] w-full lg:max-w-[400px] md:max-w-[350px] max-w-full md:block hidden"
          }
          alt="Picture of the author"
        />
      </div>
      <div className={"flex flex-col items-center text-light-purple-1 gap-2 md:mt-10 mt-4"}>
        <span>{signUpTranslations("continueWith")}</span>
        <div className={"grid md:grid-cols-6 grid-cols-3 gap-4"}>
          <Button>{signUpTranslations("providers.google")}</Button>
          <Button>{signUpTranslations("providers.yandex")}</Button>
          <Button>{signUpTranslations("providers.github")}</Button>
          <Button>{signUpTranslations("providers.facebook")}</Button>
          <Button>{signUpTranslations("providers.twitter")}</Button>
          <Button>{signUpTranslations("providers.steam")}</Button>
        </div>
      </div>
    </>
  );
};

export default SignUpView;
