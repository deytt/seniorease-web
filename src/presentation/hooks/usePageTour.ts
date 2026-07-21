"use client";

import { useCallback, useEffect, useState } from "react";
import type { DriveStep } from "driver.js";

import { consumePendingTourIf } from "@/presentation/tour/pendingTour";
import { startSeniorEaseTour } from "@/presentation/tour/startSeniorEaseTour";
import {
  markTourOffered,
  wasTourOffered,
} from "@/presentation/tour/tourStorage";

type UsePageTourOptions = {
  tourId: string;
  userId?: string;
  interfaceMode?: "basic" | "advanced";
  steps: DriveStep[];
  /** Título do diálogo de convite no Modo Básico */
  offerTitle: string;
  /** Descrição do diálogo de convite no Modo Básico */
  offerDescription: string;
};

/**
 * Hook genérico: botão "?", oferta na 1ª visita (Modo Básico) e
 * auto-start quando há tour pendente vindo do Guia do aplicativo.
 */
export function usePageTour({
  tourId,
  userId,
  interfaceMode = "advanced",
  steps,
  offerTitle,
  offerDescription,
}: UsePageTourOptions) {
  const [showOfferDialog, setShowOfferDialog] = useState(false);

  const beginTour = useCallback(() => {
    if (!userId) return;
    setShowOfferDialog(false);
    startSeniorEaseTour({ tourId, userId, steps });
  }, [steps, tourId, userId]);

  useEffect(() => {
    if (!userId) return;

    if (consumePendingTourIf(tourId)) {
      const timer = window.setTimeout(() => {
        startSeniorEaseTour({ tourId, userId, steps });
      }, 350);
      return () => window.clearTimeout(timer);
    }

    if (interfaceMode !== "basic") return;
    if (wasTourOffered(userId, tourId)) return;

    const timer = window.setTimeout(() => {
      setShowOfferDialog(true);
      markTourOffered(userId, tourId);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [interfaceMode, steps, tourId, userId]);

  const dismissOffer = useCallback(() => {
    setShowOfferDialog(false);
  }, []);

  return {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  };
}
