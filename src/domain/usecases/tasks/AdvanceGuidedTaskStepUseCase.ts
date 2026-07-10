import type { Task } from "../../entities/Task";
import type { ITaskRepository } from "../../repositories/ITaskRepository";

export class AdvanceGuidedTaskStepUseCase {
  constructor(private taskRepository: ITaskRepository) {}

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

    return this.taskRepository.updateTask(taskId, {
      steps: updatedSteps,
      status: "in_progress",
    });
  }
}
