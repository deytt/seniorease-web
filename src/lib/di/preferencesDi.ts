import { FirebasePreferencesRepository } from "@/infrastructure/firebase/FirebasePreferencesRepository";
import { GetPreferencesUseCase } from "@/domain/usecases/preferences/GetPreferencesUseCase";
import { UpdatePreferencesUseCase } from "@/domain/usecases/preferences/UpdatePreferencesUseCase";

const preferencesRepository = new FirebasePreferencesRepository();

export const getPreferencesUseCase = new GetPreferencesUseCase(
  preferencesRepository,
);
export const updatePreferencesUseCase = new UpdatePreferencesUseCase(
  preferencesRepository,
);
