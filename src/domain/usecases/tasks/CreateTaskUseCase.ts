import { Task } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";
import { HistoryActionType } from "../../history/HistoryActionType";
import type { IHistoryRecorder } from "../../history/IHistoryRecorder";
import { buildTaskCreatedTitle } from "../../history/historyTitles";

export interface CreateTaskInput {
  userId: string;
  title: string;
  description: string;
  steps: Array<{
    order: number;
    title: string;
    instruction: string;
  }>;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  category?: "medication" | "health" | "exercise" | "social" | "personal";
}

export class CreateTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private historyRecorder: IHistoryRecorder,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const now = new Date();
    const task: Omit<Task, "id" | "createdAt"> = {
      userId: input.userId,
      title: input.title,
      description: input.description,
      status: "pending",
      priority: input.priority,
      category: input.category,
      steps: input.steps.map((step, index) => ({
        id: `step_${index}`,
        taskId: "temp",
        order: step.order,
        title: step.title,
        instruction: step.instruction,
        isCompleted: false,
      })),
      dueDate: input.dueDate,
      // Necessário para a Cloud Function `sendDueNotifications` (query notified == false)
      notified: false,
      updatedAt: now,
    };

    const createdTask = await this.taskRepository.createTask(task);

    await this.historyRecorder.record({
      userId: input.userId,
      type: HistoryActionType.taskCreated,
      title: buildTaskCreatedTitle(input.title),
      entityId: createdTask.id,
      category: input.category ?? null,
    });

    return createdTask;
  }
}
