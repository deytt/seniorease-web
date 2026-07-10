import type { Task } from "@/domain/entities/Task";

/** Tarefas elegíveis para o modo guiado: pendentes/em progresso com pelo menos um passo. */
export function isGuidedTaskCandidate(task: Task): boolean {
  return (
    task.status !== "completed" &&
    Array.isArray(task.steps) &&
    task.steps.length > 0
  );
}

/** Ordena por dueDate ascendente; tarefas sem data ficam por último. */
export function sortTasksForGuidedMode(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function findNextGuidedTask(tasks: Task[]): Task | null {
  const candidates = sortTasksForGuidedMode(tasks).filter(isGuidedTaskCandidate);
  return candidates[0] ?? null;
}

/** Retoma no primeiro passo ainda não confirmado. */
export function getResumeStepIndex(task: Task): number {
  const steps = task.steps ?? [];
  if (steps.length === 0) return 0;

  const firstIncomplete = steps.findIndex((step) => !step.isCompleted);
  if (firstIncomplete === -1) {
    return steps.length - 1;
  }
  return firstIncomplete;
}

/** Índice máximo que o usuário pode visitar (passos já confirmados + passo atual em foco). */
export function getMaxNavigableStepIndex(task: Task): number {
  const steps = task.steps ?? [];
  if (steps.length === 0) return 0;

  const firstIncomplete = steps.findIndex((step) => !step.isCompleted);
  if (firstIncomplete === -1) {
    return steps.length - 1;
  }
  return firstIncomplete;
}

export function getCompletedStepCount(task: Task): number {
  return (task.steps ?? []).filter((step) => step.isCompleted).length;
}

export function getGuidedProgressPercent(task: Task): number {
  const total = task.steps?.length ?? 0;
  if (total === 0) return 0;
  return Math.round((getCompletedStepCount(task) / total) * 100);
}
