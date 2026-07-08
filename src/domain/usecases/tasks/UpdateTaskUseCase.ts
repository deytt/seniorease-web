import { Task } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";

export interface UpdateTaskInput {
  taskId: string;
  title?: string;
  description?: string;
  dueDate?: Date;
}

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const updates: Partial<Task> = {};

    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined)
      updates.description = input.description;
    if (input.dueDate !== undefined) updates.dueDate = input.dueDate;

    return this.taskRepository.updateTask(input.taskId, updates);
  }
}
