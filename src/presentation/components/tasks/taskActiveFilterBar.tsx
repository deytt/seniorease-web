"use client";

import { X } from "lucide-react";
import {
  taskFilterChipLabels,
  type TaskListFilter,
} from "@/presentation/components/tasks/taskFilter";
import { cn } from "@/lib/utils";

type TaskActiveFilterBarProps = {
  filter: TaskListFilter;
  onRemoveToday: () => void;
  onRemoveCategory: () => void;
  onRemovePriority: () => void;
  onRemoveStatus: () => void;
  className?: string;
};

/**
 * Chips removíveis dos filtros ativos — mesma ideia do `ReminderActiveFilterBar`.
 */
export function TaskActiveFilterBar({
  filter,
  onRemoveToday,
  onRemoveCategory,
  onRemovePriority,
  onRemoveStatus,
  className,
}: TaskActiveFilterBarProps) {
  const labels = taskFilterChipLabels(filter);
  if (!labels.today && !labels.category && !labels.priority && !labels.status)
    return null;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="group"
      aria-label="Filtros ativos"
      data-tour="tasks-active-filters"
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
      {labels.priority ? (
        <button
          type="button"
          onClick={onRemovePriority}
          className="advanced-only inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
          aria-label={`Remover filtro ${labels.priority}`}
        >
          {labels.priority}
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
