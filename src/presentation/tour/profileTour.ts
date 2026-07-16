import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./profileTour.css";

import { profileTourSteps } from "@/presentation/tour/profileTourSteps";
import {
  markTourCompleted,
  markTourOffered,
} from "@/presentation/tour/tourStorage";

export const PROFILE_TOUR_ID = "profile";

function scrollTourTargetIntoView(element: Element | undefined) {
  if (!element || !(element instanceof HTMLElement)) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
}

export function startProfileTour(userId: string): void {
  markTourOffered(userId, PROFILE_TOUR_ID);

  const tour = driver({
    animate: true,
    smoothScroll: true,
    allowClose: true,
    overlayColor: "#0f172a",
    overlayOpacity: 0.45,
    stagePadding: 12,
    stageRadius: 14,
    popoverClass: "seniorease-tour-popover",
    showProgress: true,
    progressText: "Passo {{current}} de {{total}}",
    nextBtnText: "Continuar",
    prevBtnText: "Voltar",
    doneBtnText: "Entendi!",
    steps: profileTourSteps,
    onHighlightStarted: (element) => {
      scrollTourTargetIntoView(element);
    },
    onDestroyed: () => {
      markTourCompleted(userId, PROFILE_TOUR_ID);
    },
  });

  tour.drive();
}
