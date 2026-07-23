import type { LoginPreferences } from "@/domain/entities/LoginPreferences";
import type { ILoginPreferencesRepository } from "@/domain/repositories/ILoginPreferencesRepository";

export class GetLoginPreferencesUseCase {
  constructor(private readonly repository: ILoginPreferencesRepository) {}

  execute(): LoginPreferences {
    return this.repository.get();
  }
}

export class SaveLoginPreferencesUseCase {
  constructor(private readonly repository: ILoginPreferencesRepository) {}

  execute(preferences: LoginPreferences): void {
    this.repository.save(preferences);
  }
}
