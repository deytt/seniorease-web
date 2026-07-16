import type { Task } from "../../entities/Task";
import type { ITaskRepository } from "../../repositories/ITaskRepository";
import { HistoryActionType } from "../../history/HistoryActionType";
import type { IHistoryRecorder } from "../../history/IHistoryRecorder";
import { buildTaskStepCompletedTitle } from "../../history/historyTitles";

export class AdvanceGuidedTaskStepUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private historyRecorder: IHistoryRecorder,
  ) {}

  /**
   * Confirma o passo atual como concluído (lógica sequencial — não desfaz passos anteriores).
   */
  async execute(taskId: string, stepIndex: number): Promise<Task> {
    const task = await this.taskRepository.getTaskById(taskId);
    if (!task) {
      throw new Error("Tarefa não encontrada");
    }

    const steps = task.steps ?? [];
    if (stepIndex < 0 || stepIndex >= steps.length) {
      throw new Error("Passo inválido");
    }

    const updatedSteps = steps.map((step, index) => ({
      ...step,
      taskId: task.id,
      isCompleted: index <= stepIndex ? true : step.isCompleted,
    }));

    const updatedTask = await this.taskRepository.updateTask(taskId, {
      steps: updatedSteps,
      status: "in_progress",
    });

    const completedStep = steps[stepIndex];
    if (completedStep) {
      await this.historyRecorder.record({
        userId: task.userId,
        type: HistoryActionType.taskStepCompleted,
        title: buildTaskStepCompletedTitle(completedStep.title),
        entityId: task.id,
        category: task.category ?? null,
      });
    }

    return updatedTask;
  }
}
