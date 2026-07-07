"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { AlertCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

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
      // TODO: Implement updatePasswordUseCase to change password
      // For now, just show success
      console.log("Changing password (current is verified)");

      reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="flex items-center gap-2">
          <Lock className="size-4" />
          Senha Atual
        </Label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="Digite sua senha atual"
          {...register("currentPassword")}
          disabled={isSubmitting}
        />
        {errors.currentPassword && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="flex items-center gap-2">
          <Lock className="size-4" />
          Nova Senha
        </Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Digite a nova senha"
          {...register("newPassword")}
          disabled={isSubmitting}
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <Lock className="size-4" />
          Confirmar Nova Senha
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirme a nova senha"
          {...register("confirmPassword")}
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <p className="text-sm text-info">
          💡 <strong>Dica:</strong> Use uma senha com pelo menos 8 caracteres,
          incluindo letras, números e símbolos para maior segurança.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Alterando..." : "Alterar Senha"}
      </Button>

      {/* Cancel Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => router.back()}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
    </form>
  );
}
