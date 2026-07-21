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
import { useDashboardTour } from "@/presentation/hooks/useDashboardTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";

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
  guides: "/icons/quick-actions/guides.svg",
} as const;

function DashboardCard({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
        className,
      )}
      {...props}
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
          ? "border-success/40 bg-success-light"
          : "border-border bg-card",
      )}
    >
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
          isCompleted
            ? "border-success bg-success text-white"
            : "border-border bg-card",
        )}
        aria-hidden
      >
        {isCompleted ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-base font-medium leading-6 text-foreground",
            isCompleted && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          {timeLabel ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
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
        className="a11y-touch-target inline-flex min-h-11 shrink-0 items-center justify-center rounded-[10px] bg-primary-light px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
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
      className="flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-[14px] border border-border p-[17px] text-center transition-colors hover:bg-muted"
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
      <span className="text-xs font-semibold text-foreground">{label}</span>
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
  const { showOfferDialog, beginTour, dismissOffer, offerTitle, offerDescription } =
    useDashboardTour({
      userId,
      interfaceMode: preferences.interfaceMode,
    });

  return (
    <div className="pb-20">
      <header
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        data-tour="dashboard-header"
      >
        <div>
          <h1 className="text-[30px] font-bold leading-9 text-foreground">
            {getDashboardGreeting()}, {firstName}! {getDashboardGreetingEmoji()}
          </h1>
          <p className="mt-1 text-base leading-6 text-muted-foreground">
            {formatDashboardDate()} · Você tem {stats.remainingToday}{" "}
            {stats.remainingToday === 1 ? "tarefa restante" : "tarefas restantes"}{" "}
            hoje
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TourHelpButton
            onClick={beginTour}
            label="Abrir tour guiado do painel"
          />
          <NotificationBell userId={userId} />
        </div>
      </header>

      <div className="relative mt-8 overflow-hidden rounded-2xl border-0 bg-primary p-6 text-primary-foreground shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-primary-foreground/10" />
        <div className="pointer-events-none absolute bottom-0 right-12 size-24 translate-y-1/2 rounded-full bg-primary-foreground/10" />

        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
            <Sparkles className="size-[18px]" aria-hidden />
            Encorajamento diário
          </div>
          <p className="mt-2 max-w-3xl text-xl font-semibold leading-8 text-primary-foreground">
            {buildEncouragementMessage(stats)}
          </p>
          <div className="mt-4 flex flex-wrap gap-6 advanced-only">
            <div className="text-center">
              <p className="text-[30px] font-bold leading-9 text-primary-foreground">
                {stats.completedYesterday}
              </p>
              <p className="text-xs text-primary-foreground/70">Ontem</p>
            </div>
            <div className="text-center">
              <p className="text-[30px] font-bold leading-9 text-primary-foreground">
                {stats.completedToday}
              </p>
              <p className="text-xs text-primary-foreground/70">Concluídas hoje</p>
            </div>
            <div className="text-center">
              <p className="text-[30px] font-bold leading-9 text-primary-foreground">
                {stats.remainingToday}
              </p>
              <p className="text-xs text-primary-foreground/70">Restantes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <DashboardCard className="p-[25px]" data-tour="dashboard-today-tasks">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold leading-7 text-foreground">
              Tarefas de hoje
            </h2>
            <Button
              asChild
              className="min-h-11 cursor-pointer rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/tasks/create">
                <Plus className="size-4" aria-hidden />
                Adicionar tarefa
              </Link>
            </Button>
          </div>

          {loading ? (
            <p className="mt-5 text-base text-muted-foreground">Carregando tarefas...</p>
          ) : todayTasks.length === 0 ? (
            <div className="mt-5 rounded-[14px] border border-dashed border-border p-8 text-center">
              <p className="text-base font-medium text-foreground">
                Nenhuma tarefa para hoje
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
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
            className="a11y-touch-target mt-4 flex min-h-11 items-center justify-center gap-1 rounded-[14px] border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Ver todas as tarefas
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </DashboardCard>

        <div className="flex flex-col gap-6">
          <DashboardCard className="p-[21px]" data-tour="dashboard-quick-actions">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[17px] font-bold leading-[25.5px] text-foreground">
                Ações rápidas
              </h2>
              {showSeedAction && onSeedDemoData ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={seeding}
                  onClick={onSeedDemoData}
                  className="min-h-11 rounded-[10px] border-border text-xs font-medium text-muted-foreground"
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
                href="/guides"
                label="Ajuda rápida"
                iconSrc={QUICK_ACTION_ICONS.guides}
                iconWrapClassName="bg-[rgba(34,197,94,0.13)]"
              />
            </div>
          </DashboardCard>

          <DashboardCard className="p-[21px]" data-tour="dashboard-reminders">
            <h2 className="text-[17px] font-bold leading-[25.5px] text-foreground">
              Lembretes próximos
            </h2>
            {loading ? (
              <p className="mt-4 text-sm text-muted-foreground">Carregando lembretes...</p>
            ) : upcomingReminders.length === 0 ? (
              <p className="mt-4 py-4 text-center text-sm text-muted-foreground">
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
                      className="flex items-center gap-3 rounded-[14px] bg-muted p-3"
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
                        <p className="text-sm font-semibold text-foreground">
                          {formatReminderListTime(scheduledAt)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
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
              className="a11y-touch-target mt-4 flex min-h-11 items-center justify-center gap-1 rounded-[14px] border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Gerenciar lembretes
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </DashboardCard>

          <section className="rounded-2xl border border-border bg-card p-[21px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <h2 className="flex items-center gap-2 text-[15px] font-bold leading-[22.5px] text-foreground">
              <Accessibility className="size-[18px] text-primary" aria-hidden />
              Status de acessibilidade
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="min-w-0 shrink text-muted-foreground">Tamanho da fonte</dt>
                <dd className="max-w-[55%] text-right font-semibold text-foreground">
                  {accessibility.fontSize}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="min-w-0 shrink text-muted-foreground">Modo de interface</dt>
                <dd className="max-w-[55%] text-right font-semibold text-foreground">
                  {accessibility.interfaceMode}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="min-w-0 shrink text-muted-foreground">Espaçamento</dt>
                <dd className="max-w-[55%] text-right font-semibold text-foreground">
                  {accessibility.spacing}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="min-w-0 shrink text-muted-foreground">Contraste</dt>
                <dd className="max-w-[55%] text-right font-semibold text-foreground">
                  {accessibility.contrast}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="min-w-0 shrink text-muted-foreground">Tema</dt>
                <dd className="max-w-[55%] text-right font-semibold text-foreground">
                  {accessibility.theme}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="min-w-0 shrink text-muted-foreground">Feedback de áudio</dt>
                <dd className="max-w-[55%] text-right font-semibold text-foreground">
                  {accessibility.audioFeedback}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="min-w-0 shrink text-muted-foreground">Alvos de toque maiores</dt>
                <dd className="max-w-[55%] text-right font-semibold text-foreground">
                  {accessibility.largeTouchTargets}
                </dd>
              </div>
            </dl>
            <Button
              asChild
              className="mt-4 min-h-11 w-full cursor-pointer rounded-[10px] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/acessibility">Ajustar configurações</Link>
            </Button>
          </section>
        </div>
      </div>

      <TourOfferDialog
        open={showOfferDialog}
        title={offerTitle}
        description={offerDescription}
        onDismiss={dismissOffer}
        onStart={beginTour}
      />
    </div>
  );
}
