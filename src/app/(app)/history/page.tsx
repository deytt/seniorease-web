"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HistoryEvent } from "@/domain/entities/HistoryEvent";
import { defaultPreferences } from "@/domain/entities/UserPreferences";
import { getHistoryDi } from "@/lib/di/historyDi";
import { HistoryScreen } from "@/presentation/components/history/historyScreen";
import type { HistoryStatsView } from "@/presentation/components/history/historyUtils";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useAuthContext } from "@/presentation/providers/AuthProvider";

const EMPTY_STATS: HistoryStatsView = {
  totalCompleted: 0,
  streak: 0,
  thisWeek: 0,
  thisMonth: 0,
};

const EMPTY_EVENTS: HistoryEvent[] = [];

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const { preferences } = usePreferences();
  const userId = user?.id ?? null;

  const [events, setEvents] = useState(EMPTY_EVENTS);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataForUserId, setDataForUserId] = useState<string | null>(null);

  if (userId !== dataForUserId) {
    setDataForUserId(userId);
    setEvents(EMPTY_EVENTS);
    setStats(EMPTY_STATS);
    setError(null);
    setLoading(Boolean(userId));
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { getHistoryEventsUseCase, getStatsUseCase } = getHistoryDi();
        const [eventsData, statsData] = await Promise.all([
          getHistoryEventsUseCase.execute(userId),
          getStatsUseCase.execute({ userId }),
        ]);

        if (!cancelled) {
          setEvents(eventsData);
          setStats(statsData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Erro ao carregar histórico",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (authLoading || !user) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center bg-background"
        role="status"
        aria-live="polite"
      >
        <p className="text-base text-muted-foreground">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <HistoryScreen
      userId={user.id}
      events={events}
      stats={stats}
      interfaceMode={
        preferences.interfaceMode ??
        defaultPreferences(user.id).interfaceMode
      }
      loading={loading}
      error={error}
    />
  );
}
