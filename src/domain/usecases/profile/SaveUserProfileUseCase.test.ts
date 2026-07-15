import { describe, expect, it, vi } from "vitest";

import type { User } from "@/domain/entities/User";
import type { IProfileRepository } from "@/domain/repositories/IProfileRepository";
import { SaveUserProfileUseCase } from "@/domain/usecases/profile/SaveUserProfileUseCase";

const mockUser: User = {
  id: "user-1",
  email: "ana@example.com",
  name: "Ana Silva",
  createdAt: new Date("2026-01-01"),
};

function createRepository(): IProfileRepository {
  return {
    getProfile: vi.fn(),
    saveProfile: vi.fn().mockResolvedValue(mockUser),
  };
}

describe("SaveUserProfileUseCase", () => {
  it("salva o perfil quando o nome é válido", async () => {
    const repository = createRepository();
    const useCase = new SaveUserProfileUseCase(repository);

    const result = await useCase.execute("user-1", { name: "Ana Silva" });

    expect(repository.saveProfile).toHaveBeenCalledWith("user-1", {
      name: "Ana Silva",
    });
    expect(result).toEqual(mockUser);
  });

  it("não valida o nome quando ele não é enviado", async () => {
    const repository = createRepository();
    const useCase = new SaveUserProfileUseCase(repository);

    await useCase.execute("user-1", { phone: "11999999999" });

    expect(repository.saveProfile).toHaveBeenCalledWith("user-1", {
      phone: "11999999999",
    });
  });

  it("bloqueia nomes com mais de 30 caracteres", async () => {
    const repository = createRepository();
    const useCase = new SaveUserProfileUseCase(repository);

    await expect(
      useCase.execute("user-1", { name: "a".repeat(31) }),
    ).rejects.toThrow("Nome deve ter no máximo 30 caracteres.");

    expect(repository.saveProfile).not.toHaveBeenCalled();
  });

  it("bloqueia nomes com menos de 3 caracteres", async () => {
    const repository = createRepository();
    const useCase = new SaveUserProfileUseCase(repository);

    await expect(useCase.execute("user-1", { name: "ab" })).rejects.toThrow(
      "Nome deve ter pelo menos 3 caracteres.",
    );

    expect(repository.saveProfile).not.toHaveBeenCalled();
  });
});
