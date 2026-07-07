"use client";

import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  Plus,
  LayoutDashboard,
  History,
  AlertTriangle,
  Bell,
  ChevronRight,
  Settings,
  Star,
  Circle,
} from "lucide-react";
import { getTasksDi } from "@/lib/di/tasksDi";
import { getRemindersDi } from "@/lib/di/remindersDi";
import { useTasks } from "@/presentation/hooks/useTasks";
import { useReminders } from "@/presentation/hooks/useReminders";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthContext();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const greetingPt = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const taskRepository = getTasksDi().taskRepository;
  const reminderRepository = getRemindersDi().reminderRepository;
  const { tasks, loading: tasksLoading, fetchTasks } = useTasks(taskRepository);
  const {
    reminders,
    loading: remindersLoading,
    fetchReminders,
  } = useReminders(reminderRepository);

  const handleLoadData = useCallback(() => {
    if (user?.id) {
      fetchTasks(user.id);
      fetchReminders(user.id);
    }
  }, [user?.id, fetchTasks, fetchReminders]);

  useEffect(() => {
    handleLoadData();
  }, [user?.id]);

  const isLoading = authLoading || (tasksLoading && remindersLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const today = new Date();
  const todayStr = today.toDateString();
  const upcomingReminders = reminders
    .filter((r) => !r.isRead && new Date(r.scheduledAt) >= today)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    )
    .slice(0, 3);

  const todayDateStr = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            {greetingPt}, {user?.name?.split(" ")[0] || "Margaret"}! ☀️
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {todayDateStr} · Você tem {pendingTasks.length}{" "}
            {pendingTasks.length === 1 ? "tarefa" : "tarefas"} restante
            {pendingTasks.length !== 1 ? "s" : ""} hoje
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2 flex-shrink-0"
          asChild
        >
          <a href="tel:1-800-736467">
            <AlertTriangle className="size-4" />
            Emergência
          </a>
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Daily Encouragement Card */}
          <Card className="bg-primary text-white border-0 overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3 opacity-90">
                <Star className="size-4 fill-yellow-300 text-yellow-300" />
                <span className="text-sm font-medium">
                  Encorajamento Diário
                </span>
              </div>
              <p className="text-lg font-medium leading-relaxed mb-5 max-w-lg">
                "Você completou {completedTasks.length} tarefa
                {completedTasks.length !== 1 ? "s" : ""} ontem — que maravilha!
                Continue com o ótimo trabalho hoje."
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-bold">{completedTasks.length}</p>
                  <p className="text-xs opacity-75 mt-0.5">Ontem</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedTasks.length}</p>
                  <p className="text-xs opacity-75 mt-0.5">Concluído hoje</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingTasks.length}</p>
                  <p className="text-xs opacity-75 mt-0.5">Restante</p>
                </div>
              </div>
              {/* Decorative circle */}
              <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="absolute right-12 bottom-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">Tarefas de Hoje</h2>
                <Button size="sm" className="gap-1.5 h-8 text-xs" asChild>
                  <Link href="/tasks/create">
                    <Plus className="size-3.5" />
                    Adicionar Tarefa
                  </Link>
                </Button>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="size-10 mx-auto mb-3 text-success" />
                  <p className="font-medium text-sm">Nenhuma tarefa pendente</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Todas as tarefas foram concluídas!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors group"
                    >
                      <Circle className="size-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {task.title}
                        </p>
                        {task.dueDate && (
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3" />
                              {new Date(task.dueDate).toLocaleTimeString(
                                "pt-BR",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        asChild
                      >
                        <Link href={`/tasks/${task.id}`}>Iniciar</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {pendingTasks.length > 4 && (
                <Link
                  href="/tasks"
                  className="flex items-center justify-center gap-1 mt-4 text-sm text-primary hover:underline"
                >
                  Ver Todas as Tarefas <ChevronRight className="size-4" />
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/tasks/create"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/50 hover:border-primary/30 transition-colors text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="size-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium">Nova Tarefa</span>
                </Link>
                <Link
                  href="/acessibility"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/50 hover:border-primary/30 transition-colors text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Settings className="size-5 text-secondary" />
                  </div>
                  <span className="text-xs font-medium">Acessibilidade</span>
                </Link>
                <Link
                  href="tel:1-800-736467"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/50 hover:border-destructive/30 transition-colors text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="size-5 text-destructive" />
                  </div>
                  <span className="text-xs font-medium">Emergência</span>
                </Link>
                <Link
                  href="/history"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/50 hover:border-warning/30 transition-colors text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <History className="size-5 text-warning" />
                  </div>
                  <span className="text-xs font-medium">Histórico</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Reminders */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold mb-4">
                Lembretes Próximos
              </h2>
              {upcomingReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum lembrete próximo
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingReminders.map((reminder) => {
                    const reminderDate = new Date(reminder.scheduledAt);
                    return (
                      <div key={reminder.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell className="size-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {reminderDate.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {reminder.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link
                href="/reminders"
                className="flex items-center justify-end gap-1 mt-4 text-xs text-primary hover:underline"
              >
                Gerenciar Lembretes <ChevronRight className="size-3" />
              </Link>
            </CardContent>
          </Card>

          {/* Accessibility Status */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Settings className="size-4 text-secondary" />
                Status de Acessibilidade
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tamanho da Fonte
                  </span>
                  <span className="font-medium text-primary">
                    Grande (120%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contraste</span>
                  <span className="font-medium text-primary">Alto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tema</span>
                  <span className="font-medium">Modo Claro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Animações</span>
                  <span className="font-medium">Reduzidas</span>
                </div>
              </div>
              <Button className="w-full mt-4 h-9 text-sm" asChild>
                <Link href="/acessibility">Ajustar Configurações</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
