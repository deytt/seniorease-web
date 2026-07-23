"use client";

import { useMemo } from "react";

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
  const steps = useMemo(() => {
    if (interfaceMode !== "basic") return dashboardTourSteps;
    // Card de acessibilidade fica oculto no Modo Básico (issue #58)
    return dashboardTourSteps.filter(
      (step) => step.element !== "[data-tour='dashboard-accessibility']",
    );
  }, [interfaceMode]);

  return usePageTour({
    tourId: "dashboard",
    userId,
    interfaceMode,
    steps,
    offerTitle: "Quer um tour guiado do Dashboard?",
    offerDescription:
      interfaceMode === "basic"
        ? "Em poucos passos, mostramos a próxima atividade, as ações rápidas e os lembretes de hoje."
        : "Em poucos passos, mostramos a próxima atividade, as ações rápidas, o status de acessibilidade e os lembretes de hoje.",
  });
}
