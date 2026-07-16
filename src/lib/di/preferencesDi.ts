import { FirebasePreferencesRepository } from "@/infrastructure/firebase/FirebasePreferencesRepository";
import { GetPreferencesUseCase } from "@/domain/usecases/preferences/GetPreferencesUseCase";
import { UpdatePreferencesUseCase } from "@/domain/usecases/preferences/UpdatePreferencesUseCase";
import { getHistoryDi } from "@/lib/di/historyDi";

const preferencesRepository = new FirebasePreferencesRepository();

export const getPreferencesUseCase = new GetPreferencesUseCase(
  preferencesRepository,
);

let updatePreferencesUseCaseInstance: UpdatePreferencesUseCase | null = null;

function createUpdatePreferencesUseCase() {
  const { historyRecorder } = getHistoryDi();
  return new UpdatePreferencesUseCase(preferencesRepository, historyRecorder);
}

export function getUpdatePreferencesUseCase() {
  if (!updatePreferencesUseCaseInstance) {
    updatePreferencesUseCaseInstance = createUpdatePreferencesUseCase();
  }
  return updatePreferencesUseCaseInstance;
}

export const updatePreferencesUseCase = {
  execute: (preferences: Parameters<UpdatePreferencesUseCase["execute"]>[0]) =>
    getUpdatePreferencesUseCase().execute(preferences),
};
