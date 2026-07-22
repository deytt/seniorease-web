export type TaskNavigationFeedback = "created" | "deleted";

const STORAGE_KEY = "seniorease:tasks:navigation-feedback";

export function setTaskNavigationFeedback(
  feedback: TaskNavigationFeedback,
): void {
  window.sessionStorage.setItem(STORAGE_KEY, feedback);
}

export function consumeTaskNavigationFeedback(): TaskNavigationFeedback | null {
  const feedback = window.sessionStorage.getItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);

  return feedback === "created" || feedback === "deleted" ? feedback : null;
}
