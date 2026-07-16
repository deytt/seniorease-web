import { FirebaseHistoryRepository } from "@/infrastructure/firebase/FirebaseHistoryRepository";
import { MockHistoryRepository } from "@/infrastructure/mock/MockHistoryRepository";
import { FirebaseHistoryRecorder } from "@/infrastructure/history/FirebaseHistoryRecorder";
import { GetHistoryEventsUseCase } from "@/domain/usecases/history/GetHistoryEventsUseCase";
import { GetStatsUseCase } from "@/domain/usecases/history/GetStatsUseCase";
import type { IHistoryRepository } from "@/domain/repositories/IHistoryRepository";
import type { IHistoryRecorder } from "@/domain/history/IHistoryRecorder";

const isDummyFirebaseKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes("Dummy");

let historyRepository: IHistoryRepository | null = null;
let historyRecorder: IHistoryRecorder | null = null;
let getHistoryEventsUseCase: GetHistoryEventsUseCase | null = null;
let getStatsUseCase: GetStatsUseCase | null = null;

export function getHistoryRepository(): IHistoryRepository {
  if (!historyRepository) {
    historyRepository = isDummyFirebaseKey
      ? new MockHistoryRepository()
      : new FirebaseHistoryRepository();
  }
  return historyRepository;
}

export function getHistoryRecorder(): IHistoryRecorder {
  if (!historyRecorder) {
    historyRecorder = new FirebaseHistoryRecorder(getHistoryRepository());
  }
  return historyRecorder;
}

export function getGetHistoryEventsUseCase(): GetHistoryEventsUseCase {
  if (!getHistoryEventsUseCase) {
    getHistoryEventsUseCase = new GetHistoryEventsUseCase(
      getHistoryRepository(),
    );
  }
  return getHistoryEventsUseCase;
}

export function getGetStatsUseCase(): GetStatsUseCase {
  if (!getStatsUseCase) {
    getStatsUseCase = new GetStatsUseCase(getHistoryRepository());
  }
  return getStatsUseCase;
}

export function getHistoryDi() {
  return {
    historyRepository: getHistoryRepository(),
    historyRecorder: getHistoryRecorder(),
    getHistoryEventsUseCase: getGetHistoryEventsUseCase(),
    getStatsUseCase: getGetStatsUseCase(),
  };
}
