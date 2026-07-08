import { ITaskRepository } from "../../repositories/ITaskRepository";

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    return this.taskRepository.deleteTask(taskId);
  }
}
