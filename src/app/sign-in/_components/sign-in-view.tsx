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

import Link from "next/link";
import { useRouter } from "next/navigation";

const SignInSchema = z.object({
  password: z.string().min(3, "Password must be at least 3 characters long"),
  email: z.string().min(1, "This field is required").email("Invalid email address. Example: test@gmail.com"),
});

export type SignInErrorType = "email" | "password";

const SignInView = () => {
  const router = useRouter();
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
          <AlertTitle>Error</AlertTitle>
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
        title: "Error",
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
            <span className={"text-4xl mb-4"}>Sign In</span>
            <div className={"w-full flex flex-col gap-3"}>
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Input variant={fieldState.invalid ? "invalid" : "default"} placeholder={"Email"} {...field} />
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
            </div>

            <div className={"flex flex-col gap-3"}>
              <Link href="/sign-up" className={"duration-300 hover:text-light-purple-1 w-max"}>
                Have no account yet?
              </Link>
              <Button variant={"secondary"} type="submit" disabled={isPending}>
                {isPending ? <Loader /> : "Sign In"}
              </Button>

              <p className="text-gray-400 text-center mt-4 md:inline hidden">"Welcome back! The journey continues."</p>
            </div>
            {/* {form.formState?.errors && (
                    <div className={"flex flex-col gap-2"}>{renderErrors}</div>
                )} */}
          </form>
        </Form>

        <Image
          src="/images/logo-1.png"
          width={500}
          height={364}
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

export default SignInView;
