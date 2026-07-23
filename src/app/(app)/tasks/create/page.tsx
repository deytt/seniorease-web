"use client";

import { useRef } from "react";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useCreateTaskTour } from "@/presentation/hooks/useCreateTaskTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";
import { BackNavigationButton } from "@/presentation/components/ui/backNavigationButton";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { CreateTaskForm } from "@/presentation/components/tasks/createTaskForm";

export default function CreateTaskPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuthContext();
  const { preferences } = usePreferences();
  const {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  } = useCreateTaskTour({
    userId: user?.id,
    interfaceMode: preferences.interfaceMode,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Header with Back Button */}
      <BackNavigationButton
        href="/tasks"
        label="Voltar para Tarefas"
        className="mb-6"
      />

      {/* Title and Instructions */}
      <div className="mb-8 flex items-start justify-between gap-4" data-tour="create-task-header">
        <div>
          <h1 className="page-title mb-2">Nova Tarefa</h1>
          <p className="text-muted-foreground">
            Preencha os detalhes abaixo. Todos os campos marcados com * são
            obrigatórios.
          </p>
        </div>
        <TourHelpButton
          onClick={beginTour}
          label="Abrir tour guiado de criação de tarefa"
        />
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6">
          <CreateTaskForm formRef={formRef} />
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
