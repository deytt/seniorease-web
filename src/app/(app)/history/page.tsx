"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { getHistoryDi } from "@/lib/di/historyDi";
import { Card, CardContent } from "@/presentation/components/ui/card";
import {
  CheckCircle2,
  Calendar,
  Zap,
  ClipboardList,
  Trophy,
} from "lucide-react";
import { HistoryEvent } from "@/domain/entities/HistoryEvent";

export default function HistoryPage() {
  const { user } = useAuthContext();
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    streak: 0,
    thisWeek: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const { getHistoryEventsUseCase, getStatsUseCase } = getHistoryDi();
        const [eventsData, statsData] = await Promise.all([
          getHistoryEventsUseCase.execute(user.id),
          getStatsUseCase.execute({ userId: user.id }),
        ]);

        setEvents(eventsData);
        setStats(statsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar histórico",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const getEventIconStyle = (eventType: string) => {
    switch (eventType) {
      case "task_completed":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          icon: CheckCircle2,
          color: "text-green-600 dark:text-green-400",
        };
      case "task_created":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          icon: ClipboardList,
          color: "text-blue-600 dark:text-blue-400",
        };
      case "reminder_marked":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          icon: Trophy,
          color: "text-yellow-600 dark:text-yellow-400",
        };
      default:
        return {
          bg: "bg-muted",
          icon: Calendar,
          color: "text-muted-foreground",
        };
    }
  };

  const formatEventDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const eventDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const timeStr = d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (eventDay.getTime() === today.getTime()) return timeStr;
    if (eventDay.getTime() === yesterday.getTime()) return `Ontem ${timeStr}`;
    return `${d.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    })} - ${timeStr}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Histórico de Atividades</h1>
        <p className="text-muted-foreground">
          Parabéns! Você tem sido muito consistente.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ClipboardList className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.thisWeek}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Atividades Esta Semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Zap className="size-5 text-orange-500 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {stats.streak}{" "}
              <span className="text-base font-normal text-muted-foreground">
                dias
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Sequência Atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Trophy className="size-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.totalCompleted}</p>
            <p className="text-sm text-muted-foreground mt-1">Conquistas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <CheckCircle2 className="size-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.thisMonth}</p>
            <p className="text-sm text-muted-foreground mt-1">Este Mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Streak Achievement Banner */}
      {stats.streak >= 7 && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
            <Trophy className="size-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-bold text-amber-900 dark:text-amber-200">
              🎉 Conquista de {stats.streak} Dias!
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Você completou atividades todos os dias por {stats.streak} dias.
              Parabéns!
            </p>
          </div>
        </div>
      )}

      {/* Recent Activity - Timeline Layout */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mb-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma atividade no histórico ainda.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative pl-10">
            {/* Timeline Line */}
            <div className="absolute left-3 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700" />

            {/* Timeline Events */}
            <div className="space-y-6">
              {events.map((event) => {
                const style = getEventIconStyle(event.eventType);
                const Icon = style.icon;
                return (
                  <div key={event.id} className="relative">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-10 top-1 h-6 w-6 rounded-full border-4 border-background ${style.bg}`}
                    >
                      <div className="flex items-center justify-center h-full">
                        <Icon className={`size-5 ${style.color}`} />
                      </div>
                    </div>

                    {/* Card Content */}
                    <Card>
                      <CardContent className="py-4 px-5">
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatEventDate(event.createdAt)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
