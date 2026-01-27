"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

import { Input, PasswordInput } from "@/components/ui/input";
import { AuthSide } from "@/src/app/[locale]/_components/auth/auth-side";
import { Link, useRouter } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { SignProviders } from "../../_components/auth/sign-providers";

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
  }, [session, router]);

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

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AuthSide title={signInTranslations("welcomeTitle")} description={signInTranslations("welcomeDescription")} />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              JourneyVerse
            </h1>
          </div>

          <div className="rounded-3xl bg-card/50 backdrop-blur-xl border border-border/40 p-8 shadow-2xl shadow-primary/5">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{signInTranslations("title")}</h2>
              <p className="text-muted-foreground">
                {signInTranslations("noAccount")}{" "}
                <Link href="/sign-up" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  {signInTranslations("createOne")}
                </Link>
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <div>
                      <Input type="email" {...field} placeholder={signInTranslations("email")} />
                      {fieldState.error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500"
                        >
                          {fieldState.error.message}
                        </motion.p>
                      )}
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <div>
                      <PasswordInput {...field} placeholder={signInTranslations("password")} />
                      {fieldState.error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500"
                        >
                          {fieldState.error.message}
                        </motion.p>
                      )}
                    </div>
                  )}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border/40 bg-muted/50 text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {signInTranslations("rememberMe")}
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {signInTranslations("forgotPassword")}
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isPending}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isPending ? commonTranslations("loading") : signInTranslations("submit")}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-background text-muted-foreground">
                      {signInTranslations("continueWith")}
                    </span>
                  </div>
                </div>
                <SignProviders handleSocialLogin={handleSocialLogin} />
              </form>
            </Form>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {signInTranslations("agreeTo")}{" "}
            <Link href="/terms" className="text-primary hover:underline">
              {signInTranslations("terms")}
            </Link>{" "}
            {signInTranslations("and")}{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              {signInTranslations("privacyPolicy")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInView;
