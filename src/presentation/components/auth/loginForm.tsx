"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, Mail, Lock } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useAuthContext } from "@/presentation/providers/AuthProvider";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail.")
    .email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const {
    signIn,
    isSigningIn,
    signInError,
    signInWithGoogle,
    isSigningInWithGoogle,
    signInWithGoogleError,
  } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  // Redirect to dashboard when user is authenticated
  useEffect(() => {
    if (user?.id && !loading) {
      router.push("/dashboard");
    }
  }, [user?.id, loading, router]);

  async function onSubmit(values: LoginFormValues) {
    await signIn(values.email, values.password);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Endereço de e-mail</Label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="seuemail@exemplo.com"
            className="pl-12"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            className="pl-12"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor="rememberMe"
          className="flex min-h-11 cursor-pointer items-center gap-2 text-base text-foreground"
        >
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          Lembrar de mim
        </label>

        <Link
          href="/forgot-password"
          className="flex min-h-11 items-center text-base font-medium text-primary underline-offset-4 hover:underline"
        >
          Esqueceu a senha?
        </Link>
      </div>

      {signInError && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-base text-destructive"
        >
          {signInError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSigningIn}>
        <LogIn aria-hidden="true" />
        {isSigningIn ? "Entrando..." : "Entrar"}
      </Button>

      <div className="relative my-1 text-center text-sm text-muted-foreground">
        <span className="relative z-10 bg-card px-3">ou</span>
        <div
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border"
        />
      </div>

      {signInWithGoogleError && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-base text-destructive"
        >
          {signInWithGoogleError}
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => signInWithGoogle()}
        disabled={isSigningIn || isSigningInWithGoogle}
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {isSigningInWithGoogle ? "Conectando..." : "Entrar com Google"}
      </Button>

      <Button asChild variant="outline" size="lg" className="w-full">
        <Link href="/register">Criar nova conta</Link>
      </Button>
    </form>
  );
}
