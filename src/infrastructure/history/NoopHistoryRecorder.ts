import type { IHistoryRecorder } from "@/domain/history/IHistoryRecorder";

/** Implementação noop para testes ou ambientes sem histórico. */
export class NoopHistoryRecorder implements IHistoryRecorder {
  async record(): Promise<void> {
    // best-effort: ignora silenciosamente
  }
}
