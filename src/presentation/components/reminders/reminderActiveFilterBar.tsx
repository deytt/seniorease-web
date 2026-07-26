"use client";

import { X } from "lucide-react";
import {
  reminderFilterChipLabel,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { cn } from "@/lib/utils";

type ReminderActiveFilterBarProps = {
  filter: ReminderListFilter;
  onRemoveToday: () => void;
  onRemoveCategory: () => void;
  onRemoveStatus: () => void;
  className?: string;
};

/**
 * Chips removíveis dos filtros ativos — paridade com `_ActiveFilterBar` do mobile.
 */
export function ReminderActiveFilterBar({
  filter,
  onRemoveToday,
  onRemoveCategory,
  onRemoveStatus,
  className,
}: ReminderActiveFilterBarProps) {
  const labels = reminderFilterChipLabel(filter);
  if (!labels.today && !labels.category && !labels.status) return null;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="group"
      aria-label="Filtros ativos"
      data-tour="reminders-active-filters"
    >
      {labels.today ? (
        <button
          type="button"
          onClick={onRemoveToday}
          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
          aria-label="Remover filtro Hoje"
        >
          {labels.today}
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
      {labels.status ? (
        <button
          type="button"
          onClick={onRemoveStatus}
          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
          aria-label={`Remover filtro ${labels.status}`}
        >
          {labels.status}
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
      {labels.category ? (
        <button
          type="button"
          onClick={onRemoveCategory}
          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
          aria-label={`Remover filtro ${labels.category}`}
        >
          {labels.category}
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
