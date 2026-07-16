"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Calendar, Loader2, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { emptyAddress } from "@/domain/entities/Address";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { MaskedInput } from "@/presentation/components/ui/maskedInput";
import { Label } from "@/presentation/components/ui/label";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import {
  PROFILE_NAME_MAX_LENGTH,
  validateProfileName,
} from "@/domain/validation/profileNameValidation";
import { getSaveUserProfileUseCase } from "@/lib/di/profileDi";
import { maskPhone } from "@/lib/inputMasks";

const editProfileSchema = z.object({
  name: z
    .string()
    .superRefine((value, ctx) => {
      const error = validateProfileName(value);
      if (error) {
        ctx.addIssue({
          code: "custom",
          message: error,
        });
      }
    }),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  neighborhood: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  onSuccess?: () => void;
}

export function EditProfileForm({ onSuccess }: EditProfileFormProps) {
  const router = useRouter();
  const { user, refreshUser } = useAuthContext();
  const { preferences } = usePreferences();
  const isBasicMode = preferences?.interfaceMode === "basic";
  const usesPasswordAuth = user?.usesPasswordAuth !== false;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      phone: "",
      cpf: "",
      ...emptyAddress(),
    },
  });

  useEffect(() => {
    if (user) {
      const address = user.address ?? emptyAddress();
      reset({
        name: user.name || "",
        birthDate: user.birthDate || "",
        phone: user.phone ? maskPhone(user.phone) : "",
        cpf: user.cpf || "",
        neighborhood: address.neighborhood,
        street: address.street,
        number: address.number,
        zipCode: address.zipCode,
        city: address.city,
        state: address.state,
        country: address.country || "Brasil",
      });
    }
  }, [user, reset]);

  async function onSubmit(values: EditProfileFormValues) {
    if (!user?.id) return;

    try {
      const saveUserProfileUseCase = getSaveUserProfileUseCase();
      await saveUserProfileUseCase.execute(user.id, {
        name: values.name,
        birthDate: values.birthDate?.trim() || null,
        phone: values.phone?.trim() || null,
        cpf: isBasicMode ? user.cpf ?? null : values.cpf?.trim() || null,
        address: {
          neighborhood: values.neighborhood?.trim() ?? "",
          street: values.street?.trim() ?? "",
          number: values.number?.trim() ?? "",
          zipCode: values.zipCode?.trim() ?? "",
          city: values.city?.trim() ?? "",
          state: values.state?.trim() ?? "",
          country: values.country?.trim() || "Brasil",
        },
      });

      await refreshUser();
      toast.success("Informações pessoais salvas!");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/profile");
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error("Não foi possível salvar as alterações. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="size-4" aria-hidden />
          Nome completo *
        </Label>
        <Input
          id="name"
          placeholder="Seu nome completo"
          className="rounded-[14px]"
          maxLength={PROFILE_NAME_MAX_LENGTH}
          {...register("name")}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" aria-hidden />
            {errors.name.message}
          </p>
        )}
      </div>

      {usesPasswordAuth ? (
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            value={user?.email ?? ""}
            readOnly
            disabled
            className="rounded-[14px] bg-[#f8fafc] text-[#64748b]"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="birthDate" className="flex items-center gap-2">
          <Calendar className="size-4" aria-hidden />
          Data de nascimento
        </Label>
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <MaskedInput
              id="birthDate"
              mask="birthDate"
              placeholder="DD/MM/AAAA"
              className="rounded-[14px]"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="size-4" aria-hidden />
          Telefone
        </Label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <MaskedInput
              id="phone"
              mask="phone"
              placeholder="(11) 99999-9999"
              className="rounded-[14px]"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {!isBasicMode ? (
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF (opcional)</Label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <MaskedInput
                id="cpf"
                mask="cpf"
                placeholder="000.000.000-00"
                className="rounded-[14px]"
                value={field.value ?? ""}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
      ) : null}

      <div className="space-y-4 rounded-[14px] border border-[#e2e8f0] p-4">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" aria-hidden />
          <h3 className="text-base font-semibold text-[#0f172a]">Endereço</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              placeholder="Nome da rua"
              className="rounded-[14px]"
              {...register("street")}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              placeholder="123"
              className="rounded-[14px]"
              {...register("number")}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              placeholder="Bairro"
              className="rounded-[14px]"
              {...register("neighborhood")}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  id="zipCode"
                  mask="zipCode"
                  placeholder="00000-000"
                  className="rounded-[14px]"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              placeholder="Cidade"
              className="rounded-[14px]"
              {...register("city")}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              placeholder="SP"
              className="rounded-[14px]"
              {...register("state")}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              placeholder="Brasil"
              className="rounded-[14px]"
              {...register("country")}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer rounded-[14px]"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            <span className="sr-only">Salvando informações pessoais</span>
          </>
        ) : (
          "Salvar alterações"
        )}
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
