const TOUR_PREFIX = "seniorease:tour";

export function wasTourOffered(userId: string, tourId: string): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(`${TOUR_PREFIX}:${userId}:${tourId}:offered`) === "1";
}

export function markTourOffered(userId: string, tourId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${TOUR_PREFIX}:${userId}:${tourId}:offered`, "1");
}

export function wasTourCompleted(userId: string, tourId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(`${TOUR_PREFIX}:${userId}:${tourId}:seen`) === "1";
}

export function markTourCompleted(userId: string, tourId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${TOUR_PREFIX}:${userId}:${tourId}:seen`, "1");
}
