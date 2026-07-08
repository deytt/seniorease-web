import { Task } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";

export class GetTaskByIdUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<Task | null> {
    return this.taskRepository.getTaskById(taskId);
  }
}
