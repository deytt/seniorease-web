"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { accessibilityTourSteps } from "@/presentation/tour/accessibilityTourSteps";

interface UseAccessibilityTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useAccessibilityTour({
  userId,
  interfaceMode = "advanced",
}: UseAccessibilityTourOptions) {
  return usePageTour({
    tourId: "accessibility",
    userId,
    interfaceMode,
    steps: accessibilityTourSteps,
    offerTitle: "Quer um tour guiado de acessibilidade?",
    offerDescription:
      "Mostramos o tamanho da letra, o modo de uso, o espaçamento e os ajustes rápidos.",
  });
}
