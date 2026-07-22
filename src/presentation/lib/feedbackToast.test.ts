import { beforeEach, describe, expect, it, vi } from "vitest";

const sonner = vi.hoisted(() => ({
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
  loading: vi.fn(),
  dismiss: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: sonner }));

import { toast, TOAST_DURATION } from "./feedbackToast";

describe("feedbackToast", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ["success", TOAST_DURATION.success],
    ["info", TOAST_DURATION.info],
    ["warning", TOAST_DURATION.warning],
    ["error", TOAST_DURATION.error],
  ] as const)("aplica a duração padrão aos toasts de %s", (type, duration) => {
    toast[type]("Mensagem", { description: "Contexto" });

    expect(sonner[type]).toHaveBeenCalledWith("Mensagem", {
      description: "Contexto",
      duration,
    });
  });

  it("não permite que chamadas locais alterem a duração padronizada", () => {
    toast.error("Não foi possível salvar.", { duration: 100 });

    expect(sonner.error).toHaveBeenCalledWith("Não foi possível salvar.", {
      duration: TOAST_DURATION.error,
    });
  });
});
