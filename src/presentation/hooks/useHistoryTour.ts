"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { HISTORY_TOUR_ID } from "@/presentation/tour/historyTour";
import { historyTourSteps } from "@/presentation/tour/historyTourSteps";

interface UseHistoryTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useHistoryTour({
  userId,
  interfaceMode = "advanced",
}: UseHistoryTourOptions) {
  return usePageTour({
    tourId: HISTORY_TOUR_ID,
    userId,
    interfaceMode,
    steps: historyTourSteps,
    offerTitle: "Quer um tour guiado do histórico?",
    offerDescription:
      "Mostramos as estatísticas e a atividade recente para você acompanhar seu progresso com tranquilidade.",
  });
}
