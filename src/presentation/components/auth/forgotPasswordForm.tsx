"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { useAuth } from "@/presentation/hooks/useAuth";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail.")
    .email("Digite um e-mail válido."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { requestPasswordReset, isRequestingReset, resetError, resetSuccess } =
    useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    await requestPasswordReset(values.email);
  }

  if (resetSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 aria-hidden="true" className="size-12 text-success" />
        <p className="text-lg text-foreground">
          Enviamos um link para redefinir sua senha. Verifique sua caixa de
          entrada (e o spam, só por garantia).
        </p>
        <Button asChild size="lg" variant="outline" className="w-full">
          <Link href="/login">
            <ArrowLeft aria-hidden="true" />
            Voltar para o Login
          </Link>
        </Button>
      </div>
    );
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
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {resetError && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-base text-destructive"
        >
          {resetError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isRequestingReset}
      >
        <Mail aria-hidden="true" />
        {isRequestingReset ? "Enviando..." : "Enviar link de redefinição"}
      </Button>

      <Button asChild variant="outline" size="lg" className="w-full">
        <Link href="/login">
          <ArrowLeft aria-hidden="true" />
          Voltar para o Login
        </Link>
      </Button>
    </form>
  );
}
