"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Accessibility,
  ChevronRight,
  Clock,
  Plus,
  Sparkles,
  Check,
} from "lucide-react";
import type { Task } from "@/domain/entities/Task";
import type { Reminder } from "@/domain/entities/Reminder";
import type { UserPreferences } from "@/domain/entities/UserPreferences";
import { cn } from "@/lib/utils";
import { getAccessibilityPreviewSummary } from "@/presentation/components/accessibility/accessibilityLabels";
import {
  buildEncouragementMessage,
  computeDashboardTaskStats,
  formatDashboardDate,
  formatReminderListTime,
  formatTaskTime,
  getDashboardGreeting,
  getDashboardGreetingEmoji,
  getTaskActionHref,
  getTaskActionLabel,
  getTodayDashboardTasks,
  getUpcomingReminders,
} from "@/presentation/components/dashboard/dashboardUtils";
import { NotificationBell } from "@/presentation/components/notifications/notificationBell";
import { getReminderCategoryVisual } from "@/presentation/components/reminders/reminderVisuals";
import {
  getTaskCategoryBadge,
  getTaskPriorityBadge,
} from "@/presentation/components/tasks/taskVisuals";
import { Button } from "@/presentation/components/ui/button";

interface DashboardScreenProps {
  userId: string;
  userName: string;
  tasks: Task[];
  reminders: Reminder[];
  preferences: UserPreferences;
  loading?: boolean;
  seeding?: boolean;
  onSeedDemoData?: () => void;
  showSeedAction?: boolean;
}

const QUICK_ACTION_ICONS = {
  newTask: "/icons/quick-actions/new-task.svg",
  accessibility: "/icons/quick-actions/accessibility.svg",
  reminders: "/icons/quick-actions/reminders.svg",
  history: "/icons/quick-actions/history.svg",
} as const;

function DashboardCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#e2e8f0] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function DashboardTaskRow({ task }: { task: Task }) {
  const isCompleted = task.status === "completed";
  const categoryBadge = getTaskCategoryBadge(task.category);
  const priorityBadge = getTaskPriorityBadge(task.priority);
  const timeLabel = formatTaskTime(task.dueDate);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[14px] border p-[17px]",
        isCompleted
          ? "border-[#bbf7d0] bg-[#f8fff8]"
          : "border-[#e2e8f0] bg-white",
      )}
    >
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
          isCompleted
            ? "border-[#22c55e] bg-[#00c950] text-white"
            : "border-[#e2e8f0] bg-white",
        )}
        aria-hidden
      >
        {isCompleted ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-base font-medium leading-6 text-[#0f172a]",
            isCompleted && "text-[#94a3b8] line-through",
          )}
        >
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          {timeLabel ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#94a3b8]">
              <Clock className="size-3" aria-hidden />
              {timeLabel}
            </span>
          ) : null}
          {categoryBadge ? (
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                categoryBadge.className,
              )}
            >
              {categoryBadge.label}
            </span>
          ) : null}
          {priorityBadge ? (
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                priorityBadge.className,
              )}
            >
              {priorityBadge.label}
            </span>
          ) : null}
        </div>
      </div>

      <Link
        href={getTaskActionHref(task)}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[10px] bg-[#eff6ff] px-3 py-1.5 text-xs font-medium text-[#2563eb] transition-colors hover:bg-[#dbeafe]"
      >
        {getTaskActionLabel(task)}
      </Link>
    </div>
  );
}

function QuickActionTile({
  href,
  label,
  iconSrc,
  iconWrapClassName,
}: {
  href: string;
  label: string;
  iconSrc: string;
  iconWrapClassName: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-[14px] border border-[#e2e8f0] p-[17px] text-center transition-colors hover:bg-[#f8fafc]"
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-[14px]",
          iconWrapClassName,
        )}
      >
        <Image
          src={iconSrc}
          alt=""
          width={20}
          height={20}
          aria-hidden
          className="size-5"
        />
      </div>
      <span className="text-xs font-semibold text-[#0f172a]">{label}</span>
    </Link>
  );
}

export function DashboardScreen({
  userId,
  userName,
  tasks,
  reminders,
  preferences,
  loading = false,
  seeding = false,
  onSeedDemoData,
  showSeedAction = false,
}: DashboardScreenProps) {
  const firstName = userName.split(" ")[0] || "Usuário";
  const stats = computeDashboardTaskStats(tasks);
  const todayTasks = getTodayDashboardTasks(tasks);
  const upcomingReminders = getUpcomingReminders(reminders);
  const accessibility = getAccessibilityPreviewSummary(preferences);

  return (
    <div className="pb-20">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[30px] font-bold leading-9 text-[#0f172a]">
            {getDashboardGreeting()}, {firstName}! {getDashboardGreetingEmoji()}
          </h1>
          <p className="mt-1 text-base leading-6 text-[#64748b]">
            {formatDashboardDate()} · Você tem {stats.remainingToday}{" "}
            {stats.remainingToday === 1 ? "tarefa restante" : "tarefas restantes"}{" "}
            hoje
          </p>
        </div>
        <NotificationBell userId={userId} />
      </header>

      <div
        className="relative mt-8 overflow-hidden rounded-2xl border border-[#e2e8f0] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
        style={{
          backgroundImage:
            "linear-gradient(174.31deg, rgb(37, 99, 235) 0%, rgb(29, 78, 216) 100%)",
        }}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-0 right-12 size-24 translate-y-1/2 rounded-full bg-white/10" />

        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-medium text-[#dbeafe]">
            <Sparkles className="size-[18px]" aria-hidden />
            Encorajamento diário
          </div>
          <p className="mt-2 max-w-3xl text-xl font-semibold leading-8 text-white">
            {buildEncouragementMessage(stats)}
          </p>
          <div className="mt-4 flex flex-wrap gap-6">
            <div className="text-center">
              <p className="text-[30px] font-bold leading-9 text-white">
                {stats.completedYesterday}
              </p>
              <p className="text-xs text-[#bedbff]">Ontem</p>
            </div>
            <div className="text-center">
              <p className="text-[30px] font-bold leading-9 text-white">
                {stats.completedToday}
              </p>
              <p className="text-xs text-[#bedbff]">Concluídas hoje</p>
            </div>
            <div className="text-center">
              <p className="text-[30px] font-bold leading-9 text-white">
                {stats.remainingToday}
              </p>
              <p className="text-xs text-[#bedbff]">Restantes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <DashboardCard className="p-[25px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold leading-7 text-[#0f172a]">
              Tarefas de hoje
            </h2>
            <Button
              asChild
              className="min-h-11 cursor-pointer rounded-[10px] bg-[#2563eb] px-4 py-2 text-sm font-medium hover:bg-[#1d4ed8]"
            >
              <Link href="/tasks/create">
                <Plus className="size-4" aria-hidden />
                Adicionar tarefa
              </Link>
            </Button>
          </div>

          {loading ? (
            <p className="mt-5 text-base text-[#64748b]">Carregando tarefas...</p>
          ) : todayTasks.length === 0 ? (
            <div className="mt-5 rounded-[14px] border border-dashed border-[#e2e8f0] p-8 text-center">
              <p className="text-base font-medium text-[#0f172a]">
                Nenhuma tarefa para hoje
              </p>
              <p className="mt-1 text-sm text-[#64748b]">
                Que tal adicionar uma nova atividade?
              </p>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-3">
              {todayTasks.map((task) => (
                <DashboardTaskRow key={task.id} task={task} />
              ))}
            </div>
          )}

          <Link
            href="/tasks"
            className="mt-4 flex min-h-11 items-center justify-center gap-1 rounded-[14px] border border-[#e2e8f0] text-sm font-medium text-[#64748b] transition-colors hover:bg-[#f8fafc]"
          >
            Ver todas as tarefas
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </DashboardCard>

        <div className="flex flex-col gap-6">
          <DashboardCard className="p-[21px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[17px] font-bold leading-[25.5px] text-[#0f172a]">
                Ações rápidas
              </h2>
              {showSeedAction && onSeedDemoData ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={seeding}
                  onClick={onSeedDemoData}
                  className="min-h-11 rounded-[10px] border-[#e2e8f0] text-xs font-medium text-[#64748b]"
                >
                  {seeding ? "Carregando exemplos..." : "Carregar exemplos"}
                </Button>
              ) : null}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <QuickActionTile
                href="/tasks/create"
                label="Nova tarefa"
                iconSrc={QUICK_ACTION_ICONS.newTask}
                iconWrapClassName="bg-[rgba(37,99,235,0.13)]"
              />
              <QuickActionTile
                href="/acessibility"
                label="Acessibilidade"
                iconSrc={QUICK_ACTION_ICONS.accessibility}
                iconWrapClassName="bg-[rgba(20,184,166,0.13)]"
              />
              <QuickActionTile
                href="/reminders"
                label="Lembretes"
                iconSrc={QUICK_ACTION_ICONS.reminders}
                iconWrapClassName="bg-[rgba(245,158,11,0.13)]"
              />
              <QuickActionTile
                href="/history"
                label="Histórico"
                iconSrc={QUICK_ACTION_ICONS.history}
                iconWrapClassName="bg-[rgba(34,197,94,0.13)]"
              />
            </div>
          </DashboardCard>

          <DashboardCard className="p-[21px]">
            <h2 className="text-[17px] font-bold leading-[25.5px] text-[#0f172a]">
              Lembretes próximos
            </h2>
            {loading ? (
              <p className="mt-4 text-sm text-[#64748b]">Carregando lembretes...</p>
            ) : upcomingReminders.length === 0 ? (
              <p className="mt-4 py-4 text-center text-sm text-[#64748b]">
                Nenhum lembrete próximo
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {upcomingReminders.map((reminder) => {
                  const visual = getReminderCategoryVisual(reminder.category);
                  const Icon = visual.Icon;
                  const scheduledAt = new Date(reminder.scheduledAt);

                  return (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 rounded-[14px] bg-[#f8fafc] p-3"
                    >
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
                          visual.bgClassName,
                        )}
                      >
                        <Icon className={cn("size-[18px]", visual.iconClassName)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0f172a]">
                          {formatReminderListTime(scheduledAt)}
                        </p>
                        <p className="truncate text-xs text-[#64748b]">
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
              className="mt-4 flex min-h-11 items-center justify-center gap-1 rounded-[14px] border border-[#e2e8f0] text-sm font-medium text-[#64748b] transition-colors hover:bg-[#f8fafc]"
            >
              Gerenciar lembretes
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </DashboardCard>

          <section className="rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] p-[21px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <h2 className="flex items-center gap-2 text-[15px] font-bold leading-[22.5px] text-[#2563eb]">
              <Accessibility className="size-[18px]" aria-hidden />
              Status de acessibilidade
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#64748b]">Tamanho da fonte</dt>
                <dd className="font-semibold text-[#2563eb]">{accessibility.fontSize}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#64748b]">Modo de interface</dt>
                <dd className="font-semibold text-[#2563eb]">
                  {accessibility.interfaceMode}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#64748b]">Espaçamento</dt>
                <dd className="font-semibold text-[#2563eb]">{accessibility.spacing}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#64748b]">Contraste</dt>
                <dd className="font-semibold text-[#2563eb]">{accessibility.contrast}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#64748b]">Tema</dt>
                <dd className="font-semibold text-[#2563eb]">{accessibility.theme}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#64748b]">Feedback de áudio</dt>
                <dd className="font-semibold text-[#2563eb]">
                  {accessibility.audioFeedback}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#64748b]">Alvos de toque maiores</dt>
                <dd className="font-semibold text-[#2563eb]">
                  {accessibility.largeTouchTargets}
                </dd>
              </div>
            </dl>
            <Button
              asChild
              className="mt-4 min-h-11 w-full cursor-pointer rounded-[10px] bg-[#2563eb] hover:bg-[#1d4ed8]"
            >
              <Link href="/acessibility">Ajustar configurações</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
