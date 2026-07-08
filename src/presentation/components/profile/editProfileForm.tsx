"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { AlertCircle, User, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { getUpdateUserUseCase } from "@/lib/di/authDi";

const editProfileSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Email inválido."),
  phone: z.string().optional(),
  cpf: z.string().optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  onSuccess?: () => void;
}

export function EditProfileForm({ onSuccess }: EditProfileFormProps) {
  const router = useRouter();
  const { user } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
    },
  });

  // Populate form with user data
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        cpf: "",
      });
    }
  }, [user, reset]);

  async function onSubmit(values: EditProfileFormValues) {
    if (!user?.id) return;

    try {
      const updateUserUseCase = getUpdateUserUseCase();
      await updateUserUseCase.execute(user.id, {
        name: values.name,
        phone: values.phone,
        cpf: values.cpf,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="size-4" />
          Nome Completo
        </Label>
        <Input
          id="name"
          placeholder="Seu nome completo"
          {...register("name")}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="size-4" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="size-4" />
          Telefone (Opcional)
        </Label>
        <Input
          id="phone"
          placeholder="(11) 99999-9999"
          {...register("phone")}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* CPF */}
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF (Opcional)</Label>
        <Input
          id="cpf"
          placeholder="000.000.000-00"
          {...register("cpf")}
          disabled={isSubmitting}
        />
        {errors.cpf && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.cpf.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
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
