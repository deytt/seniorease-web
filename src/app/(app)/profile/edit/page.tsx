"use client";

import { Loader2 } from "lucide-react";
import { ProfileFormPageShell } from "@/presentation/components/profile/profileFormPageShell";
import { EditProfileForm } from "@/presentation/components/profile/editProfileForm";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { usePersonalInfoTour } from "@/presentation/hooks/usePersonalInfoTour";
import { useAddressTour } from "@/presentation/hooks/useAddressTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";

export default function EditProfilePage() {
  const { user, loading } = useAuthContext();
  const { preferences } = usePreferences();
  const personalTour = usePersonalInfoTour({
    userId: user?.id,
    interfaceMode: preferences.interfaceMode,
  });
  // Endereço só via Guia / pending — evita dois diálogos de oferta na mesma página
  useAddressTour({
    userId: user?.id,
    interfaceMode: "advanced",
  });

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
    <>
      <ProfileFormPageShell
        backHref="/profile"
        backLabel="Voltar para o Perfil"
        title="Editar Informações Pessoais"
        description="Atualize seus dados pessoais e endereço."
        headerAction={
          <TourHelpButton
            onClick={personalTour.beginTour}
            label="Abrir tour das informações pessoais"
          />
        }
      >
        <EditProfileForm />
      </ProfileFormPageShell>

      <TourOfferDialog
        open={personalTour.showOfferDialog}
        title={personalTour.offerTitle}
        description={personalTour.offerDescription}
        onDismiss={personalTour.dismissOffer}
        onStart={personalTour.beginTour}
      />
    </>
  );
}
