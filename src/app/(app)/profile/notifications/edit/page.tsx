"use client";

import { ProfileFormPageShell } from "@/presentation/components/profile/profileFormPageShell";
import { EditNotificationPreferencesForm } from "@/presentation/components/profile/editNotificationPreferencesForm";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useNotificationPrefsTour } from "@/presentation/hooks/useNotificationPrefsTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";

export default function EditNotificationPreferencesPage() {
  const { user } = useAuthContext();
  const { preferences } = usePreferences();
  const { showOfferDialog, beginTour, dismissOffer, offerTitle, offerDescription } =
    useNotificationPrefsTour({
      userId: user?.id,
      interfaceMode: preferences.interfaceMode,
    });

  return (
    <>
      <ProfileFormPageShell
        backHref="/profile"
        backLabel="Voltar para o Perfil"
        title="Editar Preferências de Notificação"
        description="Escolha como e quando deseja receber lembretes e avisos importantes."
        headerAction={
          <TourHelpButton
            onClick={beginTour}
            label="Abrir tour das preferências de notificação"
          />
        }
      >
        <EditNotificationPreferencesForm />
      </ProfileFormPageShell>

      <TourOfferDialog
        open={showOfferDialog}
        title={offerTitle}
        description={offerDescription}
        onDismiss={dismissOffer}
        onStart={beginTour}
      />
    </>
  );
}
