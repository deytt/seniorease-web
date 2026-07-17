"use client";

import { Pencil, Trash2, Check } from "lucide-react";
import { Reminder } from "@/domain/entities/Reminder";
import { Button } from "@/presentation/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatReminderDateLabel,
  formatReminderPeriod,
  formatReminderTime,
  getReminderCategoryVisual,
  REMINDER_MESSAGE_PREVIEW_LIMITS,
  REMINDER_TITLE_PREVIEW_LIMITS,
  truncateReminderText,
} from "./reminderVisuals";

interface ReminderCardProps {
  reminder: Reminder;
  onMarkDone?: (reminderId: string) => void;
  onEdit?: (reminder: Reminder) => void;
  onDelete?: (reminder: Reminder) => void;
  showDate?: boolean;
  className?: string;
}

function ReminderActions({
  reminder,
  isCompleted,
  onMarkDone,
  onEdit,
  onDelete,
  stacked,
}: {
  reminder: Reminder;
  isCompleted: boolean;
  onMarkDone?: (reminderId: string) => void;
  onEdit?: (reminder: Reminder) => void;
  onDelete?: (reminder: Reminder) => void;
  stacked?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        stacked ? "w-full justify-start" : "shrink-0",
      )}
    >
      {isCompleted ? (
        <span className="inline-flex min-h-11 items-center gap-1.5 rounded-[10px] bg-success-light px-3 text-sm font-semibold text-success">
          <Check className="size-4" aria-hidden />
          Concluído
        </span>
      ) : (
        <>
          <Button
            type="button"
            size="sm"
            className={cn(
              "min-h-11 cursor-pointer rounded-[14px] bg-success font-bold text-white hover:bg-success/90",
              stacked && "min-h-11 min-w-0 flex-1 sm:flex-none",
            )}
            onClick={() => onMarkDone?.(reminder.id)}
            aria-label={`Marcar ${reminder.title} como concluído`}
          >
            <span className="sm:hidden">Concluir</span>
            <span className="hidden sm:inline">Marcar como concluído</span>
          </Button>
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-11 shrink-0 cursor-pointer rounded-[10px] border-border"
              onClick={() => onEdit(reminder)}
              aria-label={`Editar lembrete ${reminder.title}`}
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </>
      )}
      {onDelete && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="size-11 shrink-0 cursor-pointer rounded-[10px] border-destructive/40 text-destructive hover:bg-destructive-light hover:text-destructive"
          onClick={() => onDelete(reminder)}
          aria-label={`Excluir lembrete ${reminder.title}`}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}

function ResponsivePreviewText({
  text,
  limits,
  className,
}: {
  text: string;
  limits: { default: number; sm: number; lg: number; xl: number };
  className?: string;
}) {
  return (
    <p className={cn("truncate", className)} title={text}>
      <span className="sm:hidden">
        {truncateReminderText(text, limits.default)}
      </span>
      <span className="hidden sm:inline lg:hidden">
        {truncateReminderText(text, limits.sm)}
      </span>
      <span className="hidden lg:inline xl:hidden">
        {truncateReminderText(text, limits.lg)}
      </span>
      <span className="hidden xl:inline">
        {truncateReminderText(text, limits.xl)}
      </span>
    </p>
  );
}

/**
 * Card responsivo — Figma `15:5163`.
 * Até xl: conteúdo + ações em duas linhas.
 * Em xl+: uma linha com ações à direita (texto truncado antes de colar no botão).
 */
export function ReminderCard({
  reminder,
  onMarkDone,
  onEdit,
  onDelete,
  showDate = false,
  className,
}: ReminderCardProps) {
  const { Icon, iconClassName, bgClassName } = getReminderCategoryVisual(
    reminder.category,
  );
  const isCompleted = reminder.isRead;

  return (
    <article
      className={cn(
        "w-full max-w-full overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5",
        isCompleted && "opacity-65",
        className,
      )}
      aria-label={`${reminder.title}, ${formatReminderTime(reminder.scheduledAt)} ${formatReminderPeriod(reminder.scheduledAt)}`}
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          <div className="w-16 shrink-0 text-center sm:w-20">
            <p
              className={cn(
                "text-xl font-black leading-7 sm:text-2xl sm:leading-8",
                isCompleted ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {formatReminderTime(reminder.scheduledAt)}
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-5 text-muted-foreground">
              {formatReminderPeriod(reminder.scheduledAt)}
            </p>
            {showDate && (
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {formatReminderDateLabel(reminder.scheduledAt)}
              </p>
            )}
          </div>

          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-[14px] sm:size-12",
              bgClassName,
            )}
            aria-hidden
          >
            <Icon className={cn("size-5", iconClassName)} />
          </div>

          <div className="min-w-0 flex-1 overflow-hidden pr-1 xl:pr-3">
            <ResponsivePreviewText
              text={reminder.title}
              limits={REMINDER_TITLE_PREVIEW_LIMITS}
              className={cn(
                "text-base font-bold leading-snug sm:text-[17px] sm:leading-[25.5px]",
                isCompleted
                  ? "text-muted-foreground line-through"
                  : "text-foreground",
              )}
            />
            {reminder.message ? (
              <ResponsivePreviewText
                text={reminder.message}
                limits={REMINDER_MESSAGE_PREVIEW_LIMITS}
                className="mt-0.5 text-sm font-normal leading-5 text-muted-foreground"
              />
            ) : null}
          </div>

          <div className="hidden shrink-0 xl:block">
            <ReminderActions
              reminder={reminder}
              isCompleted={isCompleted}
              onMarkDone={onMarkDone}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        <div className="border-t border-[#f1f5f9] pt-3 xl:hidden">
          <ReminderActions
            reminder={reminder}
            isCompleted={isCompleted}
            onMarkDone={onMarkDone}
            onEdit={onEdit}
            onDelete={onDelete}
            stacked
          />
        </div>
      </div>
    </article>
  );
}
