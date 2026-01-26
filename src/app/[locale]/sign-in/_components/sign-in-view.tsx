"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";

import { Link, useRouter } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

const createSignInSchema = (validationTranslations: (key: string) => string) =>
  z.object({
    password: z.string().min(3, validationTranslations("passwordMinLength")),
    email: z.string().min(1, validationTranslations("fieldRequired")).email(validationTranslations("emailInvalid")),
  });

export type SignInErrorType = "email" | "password";

const SignInView = () => {
  const router = useRouter();
  const commonTranslations = useTranslations("Common");
  const signInTranslations = useTranslations("Auth.signIn");
  const validationTranslations = useTranslations("Auth.validation");
  const SignInSchema = createSignInSchema(validationTranslations);
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (session?.expires) {
      router.push("/");
    }
  }, [session]);

  const renderErrors = Object.keys(form.formState?.errors).map((key: string) => {
    const error = form.formState.errors[key as SignInErrorType];
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

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    try {
      setIsPending(true);
      const response = await signIn("credentials", {
        redirect: false,
        username: data.email,
        password: data.password,
      });

      if (!response?.ok) {
        throw new Error("Error");
      }
    } catch {
      setIsPending(false);
      toast({
        title: commonTranslations("error"),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className={"flex md:flex-row flex-col items-center justify-center lg:gap-10 gap-5 w-full"}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"w-full flex-col flex justify-center gap-3 max-w-[500px] md:px-0 h-full"}
          >
            <span className={"text-4xl mb-4"}>{signInTranslations("title")}</span>
            <div className={"w-full flex flex-col gap-3"}>
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Input
                    variant={fieldState.invalid ? "invalid" : "default"}
                    placeholder={signInTranslations("email")}
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <PasswordInput
                    placeholder={signInTranslations("password")}
                    variant={fieldState.invalid ? "invalid" : "default"}
                    {...field}
                  />
                )}
              />
            </div>

            <div className={"flex flex-col gap-3"}>
              <Link href="/sign-up" className={"duration-300 hover:text-muted-foreground w-max"}>
                {signInTranslations("noAccount")}
              </Link>
              <Button variant={"secondary"} type="submit" disabled={isPending}>
                {isPending ? <Loader /> : signInTranslations("submit")}
              </Button>

              <p className="text-gray-400 text-center mt-4 md:inline hidden">
                &quot;{signInTranslations("welcomeMessage")}&quot;
              </p>
            </div>
            {form.formState?.errors && <div className={"flex flex-col gap-2"}>{renderErrors}</div>}
          </form>
        </Form>

        <Image
          src="/images/logo-1.png?v=2"
          width={500}
          height={364}
          className={
            "h-full max-h-[364px] rounded-[12px] w-full lg:max-w-[400px] md:max-w-[350px] max-w-full md:block hidden"
          }
          alt="Picture of the author"
        />
      </div>

      <div className={"flex flex-col items-center text-muted-foreground gap-2 md:mt-10 mt-4"}>
        <span>{signInTranslations("continueWith")}</span>
        <div className={"grid md:grid-cols-6 grid-cols-3 gap-4"}>
          <Button>{signInTranslations("providers.google")}</Button>
          <Button>{signInTranslations("providers.yandex")}</Button>
          <Button>{signInTranslations("providers.github")}</Button>
          <Button>{signInTranslations("providers.facebook")}</Button>
          <Button>{signInTranslations("providers.twitter")}</Button>
          <Button>{signInTranslations("providers.steam")}</Button>
        </div>
      </div>
    </>
  );
};

export default SignInView;
