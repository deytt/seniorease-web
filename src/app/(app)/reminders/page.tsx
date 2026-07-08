"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { getRemindersDi } from "@/lib/di/remindersDi";
import { Button } from "@/presentation/components/ui/button";
import { Pill, Users, Activity, Bell, Plus } from "lucide-react";
import { Reminder } from "@/domain/entities/Reminder";

type FilterKey = "today" | "medication" | "appointments" | "recurring";

export default function RemindersPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("today");

  const { reminderRepository, markReminderAsReadUseCase } = getRemindersDi();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user?.id) return;
    const loadReminders = async () => {
      try {
        setLoading(true);
        const data = await reminderRepository.getReminders(user.id);
        setReminders(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar lembretes",
        );
      } finally {
        setLoading(false);
      }
    };
    loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleMarkAsRead = async (reminderId: string) => {
    try {
      await markReminderAsReadUseCase.execute(reminderId);
      setReminders((prev) =>
        prev.map((r) => (r.id === reminderId ? { ...r, isRead: true } : r)),
      );
    } catch (err) {
      console.error("Erro ao marcar como lido:", err);
    }
  };

  const getAmPm = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.getHours() < 12 ? "AM" : "PM";
  };

  const getTimeDisplay = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const hours = d.getHours() % 12 || 12;
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Infer icon from title keywords
  const getReminderIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (
      lower.includes("medic") ||
      lower.includes("comprim") ||
      lower.includes("remédio")
    ) {
      return {
        Icon: Pill,
        bg: "bg-red-100 dark:bg-red-900/30",
        color: "text-red-500",
      };
    }
    if (
      lower.includes("família") ||
      lower.includes("família") ||
      lower.includes("video") ||
      lower.includes("ligação")
    ) {
      return {
        Icon: Users,
        bg: "bg-blue-100 dark:bg-blue-900/30",
        color: "text-blue-500",
      };
    }
    return {
      Icon: Activity,
      bg: "bg-green-100 dark:bg-green-900/30",
      color: "text-green-500",
    };
  };

  const pendingCount = reminders.filter((r) => !r.isRead).length;

  const filterPills: { key: FilterKey; label: string }[] = [
    { key: "today", label: "Hoje" },
    { key: "medication", label: "Medicação" },
    { key: "appointments", label: "Consultas" },
    { key: "recurring", label: "Recorrentes" },
  ];

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Carregando lembretes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold">Central de Lembretes</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {pendingCount}{" "}
              {pendingCount === 1 ? "lembrete restante" : "lembretes restantes"}{" "}
              hoje
            </p>
          )}
        </div>
        <Button asChild size="sm">
          <Link href="/reminders/create">
            <Plus className="size-4 mr-1" />
            Novo Lembrete
          </Link>
        </Button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6 mt-4">
        {filterPills.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-input hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {reminders.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 p-10 text-center">
          <Bell className="size-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold mb-1">Nenhum lembrete ainda</p>
          <p className="text-sm text-muted-foreground mb-4">
            Crie seu primeiro lembrete para receber notificações.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/reminders/create">
              <Plus className="size-4 mr-1" />
              Criar Lembrete
            </Link>
          </Button>
        </div>
      ) : (
        /* Reminder Timeline List */
        <div className="space-y-3">
          {reminders
            .slice()
            .sort(
              (a, b) =>
                new Date(a.scheduledAt).getTime() -
                new Date(b.scheduledAt).getTime(),
            )
            .map((reminder) => {
              const { Icon, bg, color } = getReminderIcon(reminder.title);
              const isCompleted = reminder.isRead;
              return (
                <div
                  key={reminder.id}
                  className={`flex items-center gap-4 bg-card border rounded-xl px-5 py-4 transition-all ${
                    isCompleted ? "opacity-50" : ""
                  }`}
                >
                  {/* Time */}
                  <div className="flex-shrink-0 w-20 text-right">
                    <div
                      className={`text-2xl font-bold leading-none ${isCompleted ? "text-muted-foreground" : ""}`}
                    >
                      {getTimeDisplay(reminder.scheduledAt)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {getAmPm(reminder.scheduledAt)}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full ${bg} flex items-center justify-center`}
                  >
                    <Icon className={`size-5 ${color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm ${isCompleted ? "line-through text-muted-foreground" : ""}`}
                    >
                      {reminder.title}
                    </p>
                    {reminder.message && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {reminder.message}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {isCompleted ? (
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Concluído ✓
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                        onClick={() => handleMarkAsRead(reminder.id)}
                      >
                        Marcar Feito
                      </Button>
                    )}
                    <Bell className="size-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
