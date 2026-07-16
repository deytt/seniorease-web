"use client";

import { useCallback, useEffect, useState } from "react";

import {
  PROFILE_TOUR_ID,
  startProfileTour,
} from "@/presentation/tour/profileTour";
import {
  markTourOffered,
  wasTourOffered,
} from "@/presentation/tour/tourStorage";

interface UseProfileTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useProfileTour({
  userId,
  interfaceMode = "advanced",
}: UseProfileTourOptions) {
  const [showOfferDialog, setShowOfferDialog] = useState(false);

  const beginTour = useCallback(() => {
    if (!userId) return;
    setShowOfferDialog(false);
    startProfileTour(userId);
  }, [userId]);

  useEffect(() => {
    if (!userId || interfaceMode !== "basic") return;
    if (wasTourOffered(userId, PROFILE_TOUR_ID)) return;

    const timer = window.setTimeout(() => {
      setShowOfferDialog(true);
      markTourOffered(userId, PROFILE_TOUR_ID);
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
