import {
  computeHistoryStats,
  hasRecentStreakAchievement,
} from "@/domain/history/computeHistoryStats";
import {
  HistoryActionType,
  isCompletionHistoryType,
} from "@/domain/history/HistoryActionType";
import type {
  HistoryRecordInput,
  IHistoryRecorder,
} from "@/domain/history/IHistoryRecorder";
import {
  buildStreakAchievementTitle,
  STREAK_ACHIEVEMENT_DAYS,
} from "@/domain/history/historyTitles";
import type { IHistoryRepository } from "@/domain/repositories/IHistoryRepository";

/**
 * Adaptador real do port `HistoryRecorder` (ADR-017).
 * Grava eventos best-effort e regista conquista de streak quando aplicável.
 */
export class FirebaseHistoryRecorder implements IHistoryRecorder {
  constructor(private readonly historyRepository: IHistoryRepository) {}

  async record(input: HistoryRecordInput): Promise<void> {
    try {
      await this.historyRepository.logEvent({
        userId: input.userId,
        type: input.type,
        title: input.title,
        entityId: input.entityId ?? null,
        category: input.category ?? null,
        occurredAt: new Date(),
      });

      if (isCompletionHistoryType(input.type)) {
        await this.maybeRecordStreakAchievement(input.userId);
      }
    } catch (error) {
      console.error("[HistoryRecorder] Falha ao gravar histórico:", error);
    }
  }

  private async maybeRecordStreakAchievement(userId: string): Promise<void> {
    const events = await this.historyRepository.getHistoryEvents(userId);
    const stats = computeHistoryStats(events);

    if (stats.streak !== STREAK_ACHIEVEMENT_DAYS) {
      return;
    }

    if (
      hasRecentStreakAchievement(
        events,
        STREAK_ACHIEVEMENT_DAYS,
      )
    ) {
      return;
    }

    await this.historyRepository.logEvent({
      userId,
      type: HistoryActionType.streakAchievement,
      title: buildStreakAchievementTitle(STREAK_ACHIEVEMENT_DAYS),
      entityId: null,
      category: null,
      occurredAt: new Date(),
    });
  }
}
