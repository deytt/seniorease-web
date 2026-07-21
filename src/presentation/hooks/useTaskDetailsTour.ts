"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { taskDetailsTourSteps } from "@/presentation/tour/taskDetailsTourSteps";

interface UseTaskDetailsTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useTaskDetailsTour({
  userId,
  interfaceMode = "advanced",
}: UseTaskDetailsTourOptions) {
  return usePageTour({
    tourId: "taskDetails",
    userId,
    interfaceMode,
    steps: taskDetailsTourSteps,
    offerTitle: "Quer um tour guiado dos detalhes da tarefa?",
    offerDescription:
      "Mostramos o checklist de passos e as ações disponíveis para essa tarefa.",
  });
}
