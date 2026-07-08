import { Task } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";
import { IHistoryRepository } from "../../repositories/IHistoryRepository";

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
  reminderTime?: string;
}

export class CreateTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private historyRepository: IHistoryRepository,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const task: Omit<Task, "id" | "createdAt"> = {
      userId: input.userId,
      title: input.title,
      description: input.description,
      status: "pending",
      priority: input.priority,
      category: input.category,
      reminderTime: input.reminderTime,
      steps: input.steps.map((step, index) => ({
        id: `step_${index}`,
        taskId: "temp",
        order: step.order,
        title: step.title,
        instruction: step.instruction,
        isCompleted: false,
      })),
      dueDate: input.dueDate,
    };

    const createdTask = await this.taskRepository.createTask(task);

    // Create history event
    await this.historyRepository.createHistoryEvent({
      userId: input.userId,
      taskId: createdTask.id,
      eventType: "task_created",
      title: input.title,
      description: `Nova tarefa criada: ${input.title}`,
      createdAt: new Date(),
    });

    return createdTask;
  }
}
