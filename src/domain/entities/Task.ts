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
  reminderTime?: string; // Format: "HH:mm" e.g. "08:00"
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
}
