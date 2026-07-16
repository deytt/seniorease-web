import type { HistoryActionType } from "@/domain/history/HistoryActionType";

/**
 * Entidade de domínio — evento de histórico.
 * Schema Firestore: `history/{historyId}` — ver memory-bank/firebaseSchema.md
 */
export interface HistoryEvent {
  id: string;
  userId: string;
  type: HistoryActionType;
  title: string;
  entityId?: string | null;
  category?: string | null;
  occurredAt: Date;
}
