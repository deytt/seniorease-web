"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { dashboardTourSteps } from "@/presentation/tour/dashboardTourSteps";

interface UseDashboardTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useDashboardTour({
  userId,
  interfaceMode = "advanced",
}: UseDashboardTourOptions) {
  return usePageTour({
    tourId: "dashboard",
    userId,
    interfaceMode,
    steps: dashboardTourSteps,
    offerTitle: "Quer um tour guiado do Dashboard?",
    offerDescription:
      "Em poucos passos, mostramos as tarefas de hoje, as ações rápidas, o status de acessibilidade e os lembretes próximos.",
  });
}
