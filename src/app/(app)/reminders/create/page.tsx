"use client";

import Link from "next/link";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useCreateReminderTour } from "@/presentation/hooks/useCreateReminderTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { CreateReminderForm } from "@/presentation/components/reminders/createReminderForm";
import { backNavButtonClassName } from "@/presentation/lib/backNavButtonClassName";
import { cn } from "@/lib/utils";

export default function CreateReminderPage() {
  const { user } = useAuthContext();
  const { preferences } = usePreferences();
  const {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  } = useCreateReminderTour({
    userId: user?.id,
    interfaceMode: preferences.interfaceMode,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-20">
      <Link href="/reminders">
        <Button
          variant="ghost"
          size="sm"
          className={cn("mb-6", backNavButtonClassName)}
        >
          <ChevronLeft className="size-4 mr-2" />
          Voltar para Lembretes
        </Button>
      </Link>

      <div
        className="mb-8 flex items-start justify-between gap-4"
        data-tour="create-reminder-header"
      >
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Novo Lembrete</h1>
          <p className="text-base text-muted-foreground">
            Configure um lembrete para ajudá-lo a ficar no caminho certo. Todos os
            campos marcados com * são obrigatórios.
          </p>
        </div>
        <TourHelpButton
          onClick={beginTour}
          label="Abrir tour guiado de criação de lembrete"
        />
      </div>

      {/* Mesmo padrão visual dos cards da Central (Figma 16px + sombra suave) */}
      <Card className="rounded-2xl border border-border shadow-card">
        <CardContent className="p-6">
          <CreateReminderForm />
        </CardContent>
      </Card>

      <TourOfferDialog
        open={showOfferDialog}
        title={offerTitle}
        description={offerDescription}
        onDismiss={dismissOffer}
        onStart={beginTour}
      />
    </div>
  );
}
