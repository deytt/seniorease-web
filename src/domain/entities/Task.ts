import { TaskStep } from "./TaskStep";

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory =
  | "medication"
  | "health"
  | "exercise"
  | "social"
  | "personal";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  steps: TaskStep[];
  status: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  dueDate?: Date;
  completedAt?: Date;
  /** false por defeito; a Cloud Function marca true após enviar o push (ADR-020). */
  notified: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
