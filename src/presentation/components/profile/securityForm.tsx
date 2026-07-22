"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { toast } from "@/presentation/lib/feedbackToast";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { getChangePasswordUseCase } from "@/lib/di/authDi";
import { useAuthContext } from "@/presentation/providers/AuthProvider";

const securitySchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Senha atual deve ter pelo menos 6 caracteres."),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z
      .string()
      .min(6, "Confirmação deve ter pelo menos 6 caracteres."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });

type SecurityFormValues = z.infer<typeof securitySchema>;

interface SecurityFormProps {
  onSuccess?: () => void;
}

export function SecurityForm({ onSuccess }: SecurityFormProps) {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const usesPasswordAuth = user?.usesPasswordAuth !== false;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SecurityFormValues) {
    try {
      const changePasswordUseCase = getChangePasswordUseCase();
      await changePasswordUseCase.execute(
        values.currentPassword,
        values.newPassword,
      );
      reset();
      toast.success("Senha alterada com sucesso!");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/profile");
      }
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível alterar a senha. Tente novamente.";
      toast.error(message);
    }
  }

  if (loading) {
    return (
      <div
        className="flex min-h-40 items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Carregando configurações de segurança</span>
      </div>
    );
  }

  if (!usesPasswordAuth) {
    return (
      <div className="space-y-6">
        <div className="rounded-[14px] border border-primary/20 bg-primary-light p-4">
          <p className="text-sm leading-relaxed text-[#0f172a]">
            Você criou sua conta com o <strong>login do Google</strong>. Por
            isso, não há senha cadastrada na SeniorEase para alterar.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#64748b]">
            Para entrar, continue usando o botão <strong>Entrar com Google</strong>{" "}
            na tela de login.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer rounded-[14px]"
          onClick={() => router.push("/profile")}
        >
          Voltar para o Perfil
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="flex items-center gap-2">
          <Lock className="size-4" aria-hidden />
          Senha atual *
        </Label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="Digite sua senha atual"
          className="rounded-[14px]"
          {...register("currentPassword")}
          disabled={isSubmitting}
        />
        {errors.currentPassword && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" aria-hidden />
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="flex items-center gap-2">
          <Lock className="size-4" aria-hidden />
          Nova senha *
        </Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Digite a nova senha"
          className="rounded-[14px]"
          {...register("newPassword")}
          disabled={isSubmitting}
        />
        {errors.newPassword && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" aria-hidden />
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <Lock className="size-4" aria-hidden />
          Confirmar nova senha *
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirme a nova senha"
          className="rounded-[14px]"
          {...register("confirmPassword")}
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" aria-hidden />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="rounded-[14px] border border-primary/20 bg-primary-light p-4">
        <p className="text-sm leading-relaxed text-[#0f172a]">
          <strong>Dica:</strong> Use uma senha com pelo menos 8 caracteres,
          incluindo letras, números e símbolos para maior segurança.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer rounded-[14px]"
        size="lg"
        loading={isSubmitting}
        loadingText="Salvando..."
      >
        Salvar alterações
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer rounded-[14px]"
        onClick={() => router.push("/profile")}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
    </form>
  );
}
