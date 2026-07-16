import type { HistoryActionType } from "@/domain/history/HistoryActionType";

export interface HistoryRecordInput {
  userId: string;
  type: HistoryActionType;
  title: string;
  entityId?: string | null;
  category?: string | null;
}

/**
 * Port cross-feature para registo de histórico (ADR-017).
 * Implementações devem ser best-effort — nunca propagar erro.
 */
export interface IHistoryRecorder {
  record(input: HistoryRecordInput): Promise<void>;
}
