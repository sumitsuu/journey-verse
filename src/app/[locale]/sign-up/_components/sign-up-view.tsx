"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Star } from "lucide-react";
import { motion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Form, FormField } from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

import { AuthSide } from "@/src/app/[locale]/_components/auth/auth-side";
import { Link, useRouter } from "@/src/i18n/routing";
import { createUserAction } from "@/src/lib/actions/user/create-user.action";
import { CreateUserOutput } from "@/src/lib/services/user/create-user.service";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { SignProviders } from "../../_components/auth/sign-providers";

const createSignUpSchema = (validationTranslations: (key: string) => string) =>
  z
    .object({
      password: z
        .string()
        .min(8, validationTranslations("passwordMinLength8"))
        .regex(/\d/, validationTranslations("passwordContainsNumber"))
        .regex(/[A-Z]/, validationTranslations("passwordContainsUppercase")),
      passwordRepeat: z.string().min(1, validationTranslations("fieldRequired")),
      displayName: z.string().min(1, validationTranslations("fieldRequired")),
      email: z.string().min(1, validationTranslations("fieldRequired")).email(validationTranslations("emailInvalid")),
      agreeToTerms: z.boolean().refine((val) => val === true, {
        message: validationTranslations("agreeToTerms"),
      }),
    })
    .refine((data) => data.password === data.passwordRepeat, {
      message: validationTranslations("passwordsMustMatch"),
      path: ["passwordRepeat"],
    });

export type SignUpErrorType = "email" | "password" | "passwordRepeat" | "displayName" | "agreeToTerms";

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
      agreeToTerms: false,
    },
    mode: "onChange",
  });

  const password = form.watch("password");
  const passwordValue = form.watch("password");

  const passwordRequirements = [
    { text: signUpTranslations("passwordRequirements.minLength"), met: passwordValue.length >= 8 },
    { text: signUpTranslations("passwordRequirements.containsNumber"), met: /\d/.test(passwordValue) },
    { text: signUpTranslations("passwordRequirements.containsUppercase"), met: /[A-Z]/.test(passwordValue) },
  ];

  useEffect(() => {
    if (session?.expires) {
      router.push("/");
    }
  }, [session, router]);

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

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AuthSide title={signUpTranslations("welcomeTitle")} description={signUpTranslations("welcomeDescription")} />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              JourneyVerse
            </h1>
          </div>

          <div className="rounded-3xl bg-card/50 backdrop-blur-xl border border-border/40 p-8 shadow-2xl shadow-primary/5">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{signUpTranslations("createAccount")}</h2>
              <p className="text-muted-foreground">
                {signUpTranslations("hasAccount")}{" "}
                <Link href="/sign-in" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  {signUpTranslations("signIn")}
                </Link>
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        type="text"
                        {...field}
                        placeholder={signUpTranslations("name")}
                        variant={fieldState.invalid ? "invalid" : "default"}
                      />
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
                  name="email"
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        type="email"
                        {...field}
                        placeholder={signUpTranslations("email")}
                        variant={fieldState.invalid ? "invalid" : "default"}
                      />
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
                      <PasswordInput
                        {...field}
                        placeholder={signUpTranslations("password")}
                        variant={fieldState.invalid ? "invalid" : "default"}
                      />
                      {passwordValue && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 space-y-2"
                        >
                          {passwordRequirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                                  req.met ? "bg-green-500" : "bg-muted"
                                }`}
                              >
                                {req.met && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span
                                className={`text-xs transition-colors ${
                                  req.met ? "text-green-500" : "text-muted-foreground"
                                }`}
                              >
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </motion.div>
                      )}
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
                  name="passwordRepeat"
                  render={({ field, fieldState }) => (
                    <div>
                      <PasswordInput
                        {...field}
                        placeholder={signUpTranslations("confirmPassword")}
                        variant={fieldState.invalid ? "invalid" : "default"}
                      />
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
                  name="agreeToTerms"
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className={`mt-0.5 w-4 h-4 rounded border ${
                            fieldState.invalid ? "border-red-500" : "border-border/40"
                          } bg-muted/50 text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer`}
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {signUpTranslations("agreeTo")}{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            {signUpTranslations("terms")}
                          </Link>{" "}
                          {signUpTranslations("and")}{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            {signUpTranslations("privacyPolicy")}
                          </Link>
                        </span>
                      </label>
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

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={createUserMutation.isPending}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {createUserMutation.isPending ? commonTranslations("loading") : signUpTranslations("submit")}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-background text-muted-foreground">
                      {signUpTranslations("continueWith")}
                    </span>
                  </div>
                </div>

                <SignProviders handleSocialLogin={handleSocialLogin} />
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpView;
