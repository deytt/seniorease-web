"use client";

import { ProfileFormPageShell } from "@/presentation/components/profile/profileFormPageShell";
import { EditNotificationPreferencesForm } from "@/presentation/components/profile/editNotificationPreferencesForm";

export default function EditNotificationPreferencesPage() {
  return (
    <ProfileFormPageShell
      backHref="/profile"
      backLabel="Voltar para o Perfil"
      title="Editar Preferências de Notificação"
      description="Escolha como e quando deseja receber lembretes e avisos importantes."
    >
      <EditNotificationPreferencesForm />
    </ProfileFormPageShell>
  );
}
