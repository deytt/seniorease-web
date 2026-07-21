"use client";

import {
  REMINDER_LIST_FILTER_OPTIONS,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { cn } from "@/lib/utils";

type ReminderFilterChipsProps = {
  value: ReminderListFilter;
  onChange: (next: ReminderListFilter) => void;
};

export function ReminderFilterChips({
  value,
  onChange,
}: ReminderFilterChipsProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filtrar lembretes"
      data-tour="reminders-filter"
    >
      {REMINDER_LIST_FILTER_OPTIONS.map((option) => {
        const selected = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-11 cursor-pointer rounded-[10px] px-3 py-1.5 text-sm font-semibold transition-colors",
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
