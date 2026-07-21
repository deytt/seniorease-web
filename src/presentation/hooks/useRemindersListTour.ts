"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { remindersListTourSteps } from "@/presentation/tour/remindersListTourSteps";

interface UseRemindersListTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useRemindersListTour({
  userId,
  interfaceMode = "advanced",
}: UseRemindersListTourOptions) {
  return usePageTour({
    tourId: "remindersList",
    userId,
    interfaceMode,
    steps: remindersListTourSteps,
    offerTitle: "Quer um tour guiado dos lembretes?",
    offerDescription:
      "Mostramos como filtrar, criar e gerenciar seus lembretes.",
  });
}
