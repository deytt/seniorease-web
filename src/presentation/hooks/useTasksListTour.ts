"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { tasksListTourSteps } from "@/presentation/tour/tasksListTourSteps";

interface UseTasksListTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useTasksListTour({
  userId,
  interfaceMode = "advanced",
}: UseTasksListTourOptions) {
  return usePageTour({
    tourId: "tasksList",
    userId,
    interfaceMode,
    steps: tasksListTourSteps,
    offerTitle: "Quer um tour guiado das tarefas?",
    offerDescription:
      "Mostramos como pesquisar, filtrar e abrir os detalhes de cada tarefa.",
  });
}
