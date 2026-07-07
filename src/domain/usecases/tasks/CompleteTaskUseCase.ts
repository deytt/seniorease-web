import { Task } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";
import { IHistoryRepository } from "../../repositories/IHistoryRepository";

export class CompleteTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private historyRepository: IHistoryRepository,
  ) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.taskRepository.completeTask(taskId);

    // Create history event
    await this.historyRepository.createHistoryEvent({
      userId: task.userId,
      taskId: task.id,
      eventType: "task_completed",
      title: task.title,
      description: `Tarefa concluída: ${task.title}`,
      createdAt: new Date(),
    });

    return task;
  }
}
