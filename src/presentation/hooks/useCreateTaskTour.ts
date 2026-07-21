"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { createTaskTourSteps } from "@/presentation/tour/createTaskTourSteps";

interface UseCreateTaskTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useCreateTaskTour({
  userId,
  interfaceMode = "advanced",
}: UseCreateTaskTourOptions) {
  return usePageTour({
    tourId: "createTask",
    userId,
    interfaceMode,
    steps: createTaskTourSteps,
    offerTitle: "Quer um tour guiado para criar tarefas?",
    offerDescription:
      "Mostramos onde preencher o título, a prioridade, a data e os passos da tarefa.",
  });
}
