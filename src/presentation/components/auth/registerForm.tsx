"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useAuthContext } from "@/presentation/providers/AuthProvider";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Informe seu primeiro nome."),
    lastName: z.string().min(1, "Informe seu sobrenome."),
    email: z
      .string()
      .min(1, "Informe seu e-mail.")
      .email("Digite um e-mail válido."),
    phone: z.string().min(8, "Informe um telefone válido, com DDD."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Repita a senha escolhida."),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "Você precisa aceitar os termos para continuar.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { signUp, isSigningUp, signUpError } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // Redirect to dashboard when user is authenticated
  useEffect(() => {
    if (user?.id) {
      router.push("/dashboard");
    }
  }, [user?.id, router]);

  async function onSubmit(values: RegisterFormValues) {
    const fullName =
      `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
    await signUp(fullName, values.email, values.password);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            placeholder="Margaret"
            aria-invalid={Boolean(errors.firstName)}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p role="alert" className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            placeholder="Johnson"
            aria-invalid={Boolean(errors.lastName)}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p role="alert" className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Endereço de e-mail</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="seuemail@exemplo.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(11) 91234-5678"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
        {errors.phone && (
          <p role="alert" className="text-sm text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Escolha uma senha forte"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <p role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repita sua senha"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p role="alert" className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="acceptTerms"
          className="flex min-h-11 cursor-pointer items-start gap-3 text-base text-foreground"
        >
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="acceptTerms"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-1"
              />
            )}
          />
          <span>
            Eu concordo com os{" "}
            <Link
              href="/terms"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Política de Privacidade
            </Link>
          </span>
        </label>
        {errors.acceptTerms && (
          <p role="alert" className="text-sm text-destructive">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      {signUpError && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-base text-destructive"
        >
          {signUpError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSigningUp}>
        <UserPlus aria-hidden="true" />
        {isSigningUp ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-base text-muted-foreground">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
