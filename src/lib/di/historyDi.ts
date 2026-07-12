import { FirebaseHistoryRepository } from "@/infrastructure/firebase/FirebaseHistoryRepository";
import { MockHistoryRepository } from "@/infrastructure/mock/MockHistoryRepository";
import { GetHistoryEventsUseCase } from "@/domain/usecases/history/GetHistoryEventsUseCase";
import { GetStatsUseCase } from "@/domain/usecases/history/GetStatsUseCase";
import { CreateHistoryEventUseCase } from "@/domain/usecases/history/CreateHistoryEventUseCase";
import type { IHistoryRepository } from "@/domain/repositories/IHistoryRepository";

const isDummyFirebaseKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes("Dummy");

// Singleton instances
let historyRepository: IHistoryRepository | null = null;
let getHistoryEventsUseCase: GetHistoryEventsUseCase | null = null;
let getStatsUseCase: GetStatsUseCase | null = null;
let createHistoryEventUseCase: CreateHistoryEventUseCase | null = null;

export function getHistoryRepository(): IHistoryRepository {
  if (!historyRepository) {
    historyRepository = isDummyFirebaseKey
      ? new MockHistoryRepository()
      : new FirebaseHistoryRepository();
  }
  return historyRepository;
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

export function getCreateHistoryEventUseCase(): CreateHistoryEventUseCase {
  if (!createHistoryEventUseCase) {
    createHistoryEventUseCase = new CreateHistoryEventUseCase(
      getHistoryRepository(),
    );
  }
  return createHistoryEventUseCase;
}

// Factory function for DI container
export function getHistoryDi() {
  return {
    historyRepository: getHistoryRepository(),
    getHistoryEventsUseCase: getGetHistoryEventsUseCase(),
    getStatsUseCase: getGetStatsUseCase(),
    createHistoryEventUseCase: getCreateHistoryEventUseCase(),
  };
}
