const PENDING_TOUR_KEY = "seniorease:pendingTour";

export function setPendingTour(tourId: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PENDING_TOUR_KEY, tourId);
}

export function peekPendingTour(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(PENDING_TOUR_KEY);
}

/** Remove o tour pendente apenas se coincidir com `expectedTourId`. */
export function consumePendingTourIf(expectedTourId: string): boolean {
  if (typeof window === "undefined") return false;
  const tourId = window.sessionStorage.getItem(PENDING_TOUR_KEY);
  if (tourId !== expectedTourId) return false;
  window.sessionStorage.removeItem(PENDING_TOUR_KEY);
  return true;
}
