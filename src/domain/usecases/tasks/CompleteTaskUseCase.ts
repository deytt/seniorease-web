import { Task } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";
import { HistoryActionType } from "../../history/HistoryActionType";
import type { IHistoryRecorder } from "../../history/IHistoryRecorder";
import { buildTaskCompletedTitle } from "../../history/historyTitles";

export class CompleteTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private historyRecorder: IHistoryRecorder,
  ) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.taskRepository.completeTask(taskId);

    await this.historyRecorder.record({
      userId: task.userId,
      type: HistoryActionType.taskCompleted,
      title: buildTaskCompletedTitle(task.title),
      entityId: task.id,
      category: task.category ?? null,
    });

    return task;
  }
}
