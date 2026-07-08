import { FirebaseReminderRepository } from "@/infrastructure/firebase/FirebaseReminderRepository";
import { GetRemindersUseCase } from "@/domain/usecases/reminders/GetRemindersUseCase";
import { CreateReminderUseCase } from "@/domain/usecases/reminders/CreateReminderUseCase";
import { MarkReminderAsReadUseCase } from "@/domain/usecases/reminders/MarkReminderAsReadUseCase";
import { getHistoryDi } from "@/lib/di/historyDi";

// Singleton instances
let reminderRepository: FirebaseReminderRepository | null = null;
let getRemindersUseCase: GetRemindersUseCase | null = null;
let createReminderUseCase: CreateReminderUseCase | null = null;
let markReminderAsReadUseCase: MarkReminderAsReadUseCase | null = null;

export function getReminderRepository(): FirebaseReminderRepository {
  if (!reminderRepository) {
    reminderRepository = new FirebaseReminderRepository();
  }
  return reminderRepository;
}

export function getGetRemindersUseCase(): GetRemindersUseCase {
  if (!getRemindersUseCase) {
    getRemindersUseCase = new GetRemindersUseCase(getReminderRepository());
  }
  return getRemindersUseCase;
}

export function getCreateReminderUseCase(): CreateReminderUseCase {
  if (!createReminderUseCase) {
    createReminderUseCase = new CreateReminderUseCase(getReminderRepository());
  }
  return createReminderUseCase;
}

export function getMarkReminderAsReadUseCase(): MarkReminderAsReadUseCase {
  if (!markReminderAsReadUseCase) {
    const { historyRepository } = getHistoryDi();
    markReminderAsReadUseCase = new MarkReminderAsReadUseCase(
      getReminderRepository(),
      historyRepository,
    );
  }
  return markReminderAsReadUseCase;
}

// Factory function for DI container
export function getRemindersDi() {
  return {
    reminderRepository: getReminderRepository(),
    getRemindersUseCase: getGetRemindersUseCase(),
    createReminderUseCase: getCreateReminderUseCase(),
    markReminderAsReadUseCase: getMarkReminderAsReadUseCase(),
  };
}
