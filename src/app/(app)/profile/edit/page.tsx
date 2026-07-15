"use client";

import { Loader2 } from "lucide-react";
import { ProfileFormPageShell } from "@/presentation/components/profile/profileFormPageShell";
import { EditProfileForm } from "@/presentation/components/profile/editProfileForm";
import { useAuthContext } from "@/presentation/providers/AuthProvider";

export default function EditProfilePage() {
  const { loading } = useAuthContext();

  if (loading) {
    return (
      <div
        className="flex min-h-40 items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Carregando edição do perfil</span>
      </div>
    );
  }

  return (
    <ProfileFormPageShell
      backHref="/profile"
      backLabel="Voltar para o Perfil"
      title="Editar Informações Pessoais"
      description="Atualize seus dados pessoais."
    >
      <EditProfileForm />
    </ProfileFormPageShell>
  );
}
