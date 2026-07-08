import { Task } from "../entities/Task";

export interface ITaskRepository {
  getTasks(userId: string): Promise<Task[]>;
  getTaskById(taskId: string): Promise<Task | null>;
  createTask(task: Omit<Task, "id" | "createdAt">): Promise<Task>;
  updateTask(taskId: string, task: Partial<Task>): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  completeTask(taskId: string): Promise<Task>;
}
