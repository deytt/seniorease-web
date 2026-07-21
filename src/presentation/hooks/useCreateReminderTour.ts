"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { createReminderTourSteps } from "@/presentation/tour/createReminderTourSteps";

interface UseCreateReminderTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useCreateReminderTour({
  userId,
  interfaceMode = "advanced",
}: UseCreateReminderTourOptions) {
  return usePageTour({
    tourId: "createReminder",
    userId,
    interfaceMode,
    steps: createReminderTourSteps,
    offerTitle: "Quer um tour guiado para criar lembretes?",
    offerDescription:
      "Mostramos onde preencher o título, a categoria e o horário do lembrete.",
  });
}
