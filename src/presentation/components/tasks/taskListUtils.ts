import type { Task } from "@/domain/entities/Task";

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Conta tarefas efetivamente concluídas no dia civil informado. */
export function countTasksCompletedOnDate(
  tasks: Task[],
  date: Date = new Date(),
): number {
  return tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completedAt !== undefined &&
      isSameCalendarDay(task.completedAt, date),
  ).length;
}

/**
 * Ordena pela data da tarefa, da mais recente para a mais antiga.
 * Tarefas sem data ficam no fim e usam a criação como desempate.
 */
export function sortTasksByDueDateDescending(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      const dueDateDifference = b.dueDate.getTime() - a.dueDate.getTime();
      if (dueDateDifference !== 0) return dueDateDifference;
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
