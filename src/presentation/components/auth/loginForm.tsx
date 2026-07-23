"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, LogIn, Lock, Mail } from "lucide-react";

import {
  hasRememberedIdentity,
  type LoginMethod,
  type LoginPreferences,
} from "@/domain/entities/LoginPreferences";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { toast } from "@/presentation/lib/feedbackToast";
import {
  getLoginPreferencesUseCase,
  saveLoginPreferencesUseCase,
} from "@/lib/di/authDi";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail.")
    .email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  rememberMe: z.boolean(),
});

const rememberedPasswordSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RememberedPasswordValues = z.infer<typeof rememberedPasswordSchema>;

function GoogleIcon() {
  return (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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
  );
}

interface RememberedAccountCardProps {
  email: string;
  method: LoginMethod | null;
  disabled?: boolean;
  onUseAnotherAccount: () => void;
}

function RememberedAccountCard({
  email,
  method,
  disabled,
  onUseAnotherAccount,
}: RememberedAccountCardProps) {
  const initial = email.charAt(0).toUpperCase() || "?";
  const isGoogle = method === "google";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4">
      <div
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">
          {isGoogle ? "Você entra com o Google" : "Continue como"}
        </p>
        <p className="truncate text-base font-semibold text-foreground">
          {email}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="min-h-11 shrink-0"
        disabled={disabled}
        onClick={onUseAnotherAccount}
      >
        Trocar
      </Button>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const redirectHandled = useRef(false);

  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [rememberedEmail, setRememberedEmail] = useState<string | null>(null);
  const [lastMethod, setLastMethod] = useState<LoginMethod | null>(null);
  const [showPasswordForRemembered, setShowPasswordForRemembered] =
    useState(false);

  const {
    signIn,
    isSigningIn,
    signInError,
    signInWithGoogle,
    completeGoogleRedirect,
    isSigningInWithGoogle,
    signInWithGoogleError,
  } = useAuth();

  const isBusy = isSigningIn || isSigningInWithGoogle;
  const hasRemembered = rememberedEmail != null;
  const prefersGoogle = lastMethod === "google";

  const standardForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  const rememberedForm = useForm<RememberedPasswordValues>({
    resolver: zodResolver(rememberedPasswordSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const prefs = getLoginPreferencesUseCase.execute();
      setRememberMe(prefs.rememberMe);
      if (hasRememberedIdentity(prefs) && prefs.lastEmail) {
        setRememberedEmail(prefs.lastEmail);
        setLastMethod(prefs.lastMethod);
      }
      standardForm.reset({
        email: "",
        password: "",
        rememberMe: prefs.rememberMe,
      });
      setPrefsLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [standardForm]);

  useEffect(() => {
    if (user?.id && !loading) {
      router.push("/dashboard");
    }
  }, [user?.id, loading, router]);

  useEffect(() => {
    if (redirectHandled.current) return;
    redirectHandled.current = true;
    void completeGoogleRedirect();
  }, [completeGoogleRedirect]);

  useEffect(() => {
    if (signInError) toast.error(signInError);
  }, [signInError]);

  useEffect(() => {
    if (signInWithGoogleError) toast.error(signInWithGoogleError);
  }, [signInWithGoogleError]);

  useEffect(() => {
    if (showPasswordForRemembered && !prefersGoogle) {
      window.setTimeout(() => {
        document.getElementById("remembered-password")?.focus();
      }, 0);
    }
  }, [showPasswordForRemembered, prefersGoogle]);

  function useAnotherAccount() {
    setRememberedEmail(null);
    setLastMethod(null);
    setShowPasswordForRemembered(false);
    rememberedForm.reset({ password: "" });
    standardForm.reset({
      email: "",
      password: "",
      rememberMe,
    });
    // Mantém a preferência do checkbox; limpa só a identidade (paridade mobile)
    saveLoginPreferencesUseCase.execute({
      rememberMe,
      lastEmail: null,
      lastMethod: null,
    } satisfies LoginPreferences);
  }

  async function handleEnterForRemembered() {
    if (!rememberedEmail) return;

    if (prefersGoogle) {
      await signInWithGoogle(rememberMe);
      return;
    }

    setShowPasswordForRemembered(true);
  }

  async function onStandardSubmit(values: LoginFormValues) {
    setRememberMe(values.rememberMe);
    await signIn(values.email, values.password, values.rememberMe);
  }

  async function onRememberedPasswordSubmit(values: RememberedPasswordValues) {
    if (!rememberedEmail) return;
    await signIn(rememberedEmail, values.password, rememberMe);
  }

  if (!prefsLoaded) {
    return (
      <p className="text-center text-muted-foreground" role="status">
        Carregando...
      </p>
    );
  }

  if (hasRemembered) {
    return (
      <div className="flex flex-col gap-6">
        <p className="-mt-2 text-center text-base text-muted-foreground">
          Confirme para entrar na sua conta
        </p>

        <RememberedAccountCard
          email={rememberedEmail}
          method={lastMethod}
          disabled={isBusy}
          onUseAnotherAccount={useAnotherAccount}
        />

        {showPasswordForRemembered && !prefersGoogle && (
          <form
            onSubmit={rememberedForm.handleSubmit(onRememberedPasswordSubmit)}
            noValidate
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="remembered-password">Senha</Label>
              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="remembered-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  className="pl-12"
                  aria-invalid={Boolean(rememberedForm.formState.errors.password)}
                  {...rememberedForm.register("password")}
                />
              </div>
              {rememberedForm.formState.errors.password && (
                <p role="alert" className="text-sm text-destructive">
                  {rememberedForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {signInError && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 p-3 text-base text-destructive"
              >
                {signInError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={isSigningIn}
              loadingText="Entrando..."
            >
              <Check aria-hidden="true" />
              Confirmar entrada
            </Button>
          </form>
        )}

        {(!showPasswordForRemembered || prefersGoogle) && (
          <>
            {signInWithGoogleError && prefersGoogle && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 p-3 text-base text-destructive"
              >
                {signInWithGoogleError}
              </p>
            )}

            <Button
              type="button"
              size="lg"
              className="w-full"
              variant={prefersGoogle ? "outline" : "default"}
              onClick={() => void handleEnterForRemembered()}
              disabled={isBusy}
              loading={isBusy}
              loadingText={prefersGoogle ? "Conectando..." : "Entrando..."}
            >
              {prefersGoogle ? (
                <>
                  <GoogleIcon />
                  Continuar com Google
                </>
              ) : (
                <>
                  <LogIn aria-hidden="true" />
                  Entrar
                </>
              )}
            </Button>
          </>
        )}

        <button
          type="button"
          className="mx-auto flex min-h-11 items-center text-base text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
          disabled={isBusy}
          onClick={useAnotherAccount}
        >
          Usar outra conta
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={standardForm.handleSubmit(onStandardSubmit)}
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
            aria-invalid={Boolean(standardForm.formState.errors.email)}
            aria-describedby={
              standardForm.formState.errors.email ? "email-error" : undefined
            }
            {...standardForm.register("email")}
          />
        </div>
        {standardForm.formState.errors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {standardForm.formState.errors.email.message}
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
            aria-invalid={Boolean(standardForm.formState.errors.password)}
            aria-describedby={
              standardForm.formState.errors.password
                ? "password-error"
                : undefined
            }
            {...standardForm.register("password")}
          />
        </div>
        {standardForm.formState.errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {standardForm.formState.errors.password.message}
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
            control={standardForm.control}
            render={({ field }) => (
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={(checked) => {
                  const value = checked === true;
                  field.onChange(value);
                  setRememberMe(value);
                }}
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

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={isSigningIn}
        loadingText="Entrando..."
      >
        <LogIn aria-hidden="true" />
        Entrar
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
        onClick={() =>
          void signInWithGoogle(standardForm.getValues("rememberMe"))
        }
        disabled={isBusy}
        loading={isSigningInWithGoogle}
        loadingText="Conectando..."
      >
        <GoogleIcon />
        Entrar com Google
      </Button>

      <Button asChild variant="outline" size="lg" className="w-full">
        <Link href="/register">Criar nova conta</Link>
      </Button>
    </form>
  );
}
