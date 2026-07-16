import { FirebaseReminderRepository } from "@/infrastructure/firebase/FirebaseReminderRepository";
import { GetRemindersUseCase } from "@/domain/usecases/reminders/GetRemindersUseCase";
import { CreateReminderUseCase } from "@/domain/usecases/reminders/CreateReminderUseCase";
import { UpdateReminderUseCase } from "@/domain/usecases/reminders/UpdateReminderUseCase";
import { DeleteReminderUseCase } from "@/domain/usecases/reminders/DeleteReminderUseCase";
import { MarkReminderAsReadUseCase } from "@/domain/usecases/reminders/MarkReminderAsReadUseCase";
import { getHistoryDi } from "@/lib/di/historyDi";

let reminderRepository: FirebaseReminderRepository | null = null;
let getRemindersUseCase: GetRemindersUseCase | null = null;
let createReminderUseCase: CreateReminderUseCase | null = null;
let updateReminderUseCase: UpdateReminderUseCase | null = null;
let deleteReminderUseCase: DeleteReminderUseCase | null = null;
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
    const { historyRecorder } = getHistoryDi();
    createReminderUseCase = new CreateReminderUseCase(
      getReminderRepository(),
      historyRecorder,
    );
  }
  return createReminderUseCase;
}

export function getUpdateReminderUseCase(): UpdateReminderUseCase {
  if (!updateReminderUseCase) {
    const { historyRecorder } = getHistoryDi();
    updateReminderUseCase = new UpdateReminderUseCase(
      getReminderRepository(),
      historyRecorder,
    );
  }
  return updateReminderUseCase;
}

export function getDeleteReminderUseCase(): DeleteReminderUseCase {
  if (!deleteReminderUseCase) {
    const { historyRecorder } = getHistoryDi();
    deleteReminderUseCase = new DeleteReminderUseCase(
      getReminderRepository(),
      historyRecorder,
    );
  }
  return deleteReminderUseCase;
}

export function getMarkReminderAsReadUseCase(): MarkReminderAsReadUseCase {
  if (!markReminderAsReadUseCase) {
    const { historyRecorder } = getHistoryDi();
    markReminderAsReadUseCase = new MarkReminderAsReadUseCase(
      getReminderRepository(),
      historyRecorder,
    );
  }
  return markReminderAsReadUseCase;
}

export function getRemindersDi() {
  return {
    reminderRepository: getReminderRepository(),
    getRemindersUseCase: getGetRemindersUseCase(),
    createReminderUseCase: getCreateReminderUseCase(),
    updateReminderUseCase: getUpdateReminderUseCase(),
    deleteReminderUseCase: getDeleteReminderUseCase(),
    markReminderAsReadUseCase: getMarkReminderAsReadUseCase(),
  };
}
