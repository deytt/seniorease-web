import type { Task } from "@/domain/entities/Task";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";

const MOCK_TASKS_STORAGE_KEY = "mock_tasks";

/**
 * Mock do repositório de tarefas para desenvolvimento local.
 * Persiste dados em localStorage para manter entre recarregamentos.
 */
export class MockTaskRepository implements ITaskRepository {
  private loadTasks(): Task[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(MOCK_TASKS_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as Task[];
      // Rehydrate dates
      return parsed.map((t) => ({
        ...t,
        notified: t.notified ?? false,
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        createdAt: new Date(t.createdAt),
      }));
    } catch {
      return [];
    }
  }

  private saveTasks(tasks: Task[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(MOCK_TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }

  async getTasks(userId: string): Promise<Task[]> {
    return this.loadTasks().filter((t) => t.userId === userId);
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return this.loadTasks().find((t) => t.id === taskId) ?? null;
  }

  async createTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
    const tasks = this.loadTasks();
    const newTask: Task = {
      ...task,
      id: "mock-task-" + Date.now() + "-" + Math.random().toString(36).slice(2),
      notified: task.notified ?? false,
      createdAt: new Date(),
    };
    this.saveTasks([...tasks, newTask]);
    return newTask;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const tasks = this.loadTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error("Tarefa não encontrada");
    const updated = { ...tasks[index], ...updates };
    tasks[index] = updated;
    this.saveTasks(tasks);
    return updated;
  }

  async deleteTask(taskId: string): Promise<void> {
    const tasks = this.loadTasks().filter((t) => t.id !== taskId);
    this.saveTasks(tasks);
  }

  async completeTask(taskId: string): Promise<Task> {
    return this.updateTask(taskId, {
      status: "completed",
      completedAt: new Date(),
    });
  }
}
