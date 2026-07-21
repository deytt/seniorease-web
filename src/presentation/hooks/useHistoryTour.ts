"use client";

import { useCallback, useEffect, useState } from "react";

import {
  HISTORY_TOUR_ID,
  startHistoryTour,
} from "@/presentation/tour/historyTour";
import { consumePendingTourIf } from "@/presentation/tour/pendingTour";
import {
  markTourOffered,
  wasTourOffered,
} from "@/presentation/tour/tourStorage";

interface UseHistoryTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useHistoryTour({
  userId,
  interfaceMode = "advanced",
}: UseHistoryTourOptions) {
  const [showOfferDialog, setShowOfferDialog] = useState(false);

  const beginTour = useCallback(() => {
    if (!userId) return;
    setShowOfferDialog(false);
    startHistoryTour(userId);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    if (consumePendingTourIf(HISTORY_TOUR_ID)) {
      const timer = window.setTimeout(() => {
        startHistoryTour(userId);
      }, 350);
      return () => window.clearTimeout(timer);
    }

    if (interfaceMode !== "basic") return;
    if (wasTourOffered(userId, HISTORY_TOUR_ID)) return;

    const timer = window.setTimeout(() => {
      setShowOfferDialog(true);
      markTourOffered(userId, HISTORY_TOUR_ID);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [interfaceMode, userId]);

  const dismissOffer = useCallback(() => {
    setShowOfferDialog(false);
  }, []);

  return {
    showOfferDialog,
    beginTour,
    dismissOffer,
  };
}
