import { ITaskRepository } from "../../repositories/ITaskRepository";
import { HistoryActionType } from "../../history/HistoryActionType";
import type { IHistoryRecorder } from "../../history/IHistoryRecorder";
import { buildTaskDeletedTitle } from "../../history/historyTitles";

export class DeleteTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private historyRecorder: IHistoryRecorder,
  ) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.getTaskById(taskId);
    await this.taskRepository.deleteTask(taskId);

    if (task) {
      await this.historyRecorder.record({
        userId: task.userId,
        type: HistoryActionType.taskDeleted,
        title: buildTaskDeletedTitle(task.title),
        entityId: task.id,
        category: task.category ?? null,
      });
    }
  }
}
