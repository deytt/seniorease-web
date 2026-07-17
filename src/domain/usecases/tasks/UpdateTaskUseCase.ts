import { Task, TaskStatus } from "../../entities/Task";
import type { TaskStep } from "../../entities/TaskStep";
import { ITaskRepository } from "../../repositories/ITaskRepository";

export interface UpdateTaskInput {
  taskId: string;
  title?: string;
  description?: string;
  dueDate?: Date;
  steps?: TaskStep[];
  status?: TaskStatus;
}

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const updates: Partial<Task> = {
      updatedAt: new Date(),
    };

    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined)
      updates.description = input.description;
    if (input.dueDate !== undefined) {
      updates.dueDate = input.dueDate;
      // Repõe o flag para a Cloud Function reenviar o push no novo horário
      updates.notified = false;
    }
    if (input.steps !== undefined) updates.steps = input.steps;
    if (input.status !== undefined) updates.status = input.status;

    return this.taskRepository.updateTask(input.taskId, updates);
  }
}
