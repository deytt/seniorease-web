"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { guidedTaskTourSteps } from "@/presentation/tour/guidedTaskTourSteps";

interface UseGuidedTaskTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useGuidedTaskTour({
  userId,
  interfaceMode = "advanced",
}: UseGuidedTaskTourOptions) {
  return usePageTour({
    tourId: "guidedTask",
    userId,
    interfaceMode,
    steps: guidedTaskTourSteps,
    offerTitle: "Quer um tour guiado do Modo Guiado?",
    offerDescription:
      "Mostramos como acompanhar o progresso e confirmar cada passo com calma.",
  });
}
