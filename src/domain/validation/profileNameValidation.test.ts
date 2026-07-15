import { describe, expect, it } from "vitest";

import {
  PROFILE_NAME_MAX_LENGTH,
  PROFILE_NAME_MIN_LENGTH,
  validateProfileName,
} from "@/domain/validation/profileNameValidation";

describe("validateProfileName", () => {
  it("aceita nomes dentro do intervalo permitido", () => {
    expect(validateProfileName("Ana")).toBeNull();
    expect(validateProfileName("Maria da Silva")).toBeNull();
    expect(validateProfileName("a".repeat(PROFILE_NAME_MAX_LENGTH))).toBeNull();
  });

  it("rejeita nomes com menos de 3 caracteres", () => {
    expect(validateProfileName("")).toBe("Nome deve ter pelo menos 3 caracteres.");
    expect(validateProfileName("  a  ")).toBe(
      "Nome deve ter pelo menos 3 caracteres.",
    );
  });

  it("rejeita nomes com mais de 30 caracteres", () => {
    expect(validateProfileName("a".repeat(PROFILE_NAME_MAX_LENGTH + 1))).toBe(
      `Nome deve ter no máximo ${PROFILE_NAME_MAX_LENGTH} caracteres.`,
    );
  });

  it("usa trim antes de validar o tamanho", () => {
    expect(validateProfileName(`  ${"b".repeat(PROFILE_NAME_MIN_LENGTH)}  `)).toBeNull();
  });

  it("expõe limites alinhados ao mobile", () => {
    expect(PROFILE_NAME_MIN_LENGTH).toBe(3);
    expect(PROFILE_NAME_MAX_LENGTH).toBe(30);
  });
});
