import { FirebaseTaskRepository } from "@/infrastructure/firebase/FirebaseTaskRepository";
import { MockTaskRepository } from "@/infrastructure/mock/MockTaskRepository";
import { GetTasksUseCase } from "@/domain/usecases/tasks/GetTasksUseCase";
import { GetTaskByIdUseCase } from "@/domain/usecases/tasks/GetTaskByIdUseCase";
import { CreateTaskUseCase } from "@/domain/usecases/tasks/CreateTaskUseCase";
import { UpdateTaskUseCase } from "@/domain/usecases/tasks/UpdateTaskUseCase";
import { DeleteTaskUseCase } from "@/domain/usecases/tasks/DeleteTaskUseCase";
import { AdvanceGuidedTaskStepUseCase } from "@/domain/usecases/tasks/AdvanceGuidedTaskStepUseCase";
import { CompleteTaskUseCase } from "@/domain/usecases/tasks/CompleteTaskUseCase";
import { getHistoryDi } from "@/lib/di/historyDi";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";

const isDummyFirebaseKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes("Dummy");

// Singleton instances
let taskRepository: ITaskRepository | null = null;
let getTasksUseCase: GetTasksUseCase | null = null;
let getTaskByIdUseCase: GetTaskByIdUseCase | null = null;
let createTaskUseCase: CreateTaskUseCase | null = null;
let updateTaskUseCase: UpdateTaskUseCase | null = null;
let deleteTaskUseCase: DeleteTaskUseCase | null = null;
let completeTaskUseCase: CompleteTaskUseCase | null = null;
let advanceGuidedTaskStepUseCase: AdvanceGuidedTaskStepUseCase | null = null;

export function getTaskRepository(): ITaskRepository {
  if (!taskRepository) {
    taskRepository = isDummyFirebaseKey
      ? new MockTaskRepository()
      : new FirebaseTaskRepository();
  }
  return taskRepository;
}

export function getGetTasksUseCase(): GetTasksUseCase {
  if (!getTasksUseCase) {
    getTasksUseCase = new GetTasksUseCase(getTaskRepository());
  }
  return getTasksUseCase;
}

export function getGetTaskByIdUseCase(): GetTaskByIdUseCase {
  if (!getTaskByIdUseCase) {
    getTaskByIdUseCase = new GetTaskByIdUseCase(getTaskRepository());
  }
  return getTaskByIdUseCase;
}

export function getCreateTaskUseCase(): CreateTaskUseCase {
  if (!createTaskUseCase) {
    const { historyRepository } = getHistoryDi();
    createTaskUseCase = new CreateTaskUseCase(
      getTaskRepository(),
      historyRepository,
    );
  }
  return createTaskUseCase;
}

export function getUpdateTaskUseCase(): UpdateTaskUseCase {
  if (!updateTaskUseCase) {
    updateTaskUseCase = new UpdateTaskUseCase(getTaskRepository());
  }
  return updateTaskUseCase;
}

export function getDeleteTaskUseCase(): DeleteTaskUseCase {
  if (!deleteTaskUseCase) {
    deleteTaskUseCase = new DeleteTaskUseCase(getTaskRepository());
  }
  return deleteTaskUseCase;
}

export function getCompleteTaskUseCase(): CompleteTaskUseCase {
  if (!completeTaskUseCase) {
    const { historyRepository } = getHistoryDi();
    completeTaskUseCase = new CompleteTaskUseCase(
      getTaskRepository(),
      historyRepository,
    );
  }
  return completeTaskUseCase;
}

export function getAdvanceGuidedTaskStepUseCase(): AdvanceGuidedTaskStepUseCase {
  if (!advanceGuidedTaskStepUseCase) {
    advanceGuidedTaskStepUseCase = new AdvanceGuidedTaskStepUseCase(
      getTaskRepository(),
    );
  }
  return advanceGuidedTaskStepUseCase;
}

// Factory function for DI container
export function getTasksDi() {
  return {
    taskRepository: getTaskRepository(),
    getTasksUseCase: getGetTasksUseCase(),
    getTaskByIdUseCase: getGetTaskByIdUseCase(),
    createTaskUseCase: getCreateTaskUseCase(),
    updateTaskUseCase: getUpdateTaskUseCase(),
    deleteTaskUseCase: getDeleteTaskUseCase(),
    completeTaskUseCase: getCompleteTaskUseCase(),
    advanceGuidedTaskStepUseCase: getAdvanceGuidedTaskStepUseCase(),
  };
}
