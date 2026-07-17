"use client";

import { useState } from "react";
import type { ReminderCategory } from "@/domain/entities/ReminderCategory";
import {
  REMINDER_CATEGORIES,
  REMINDER_CATEGORY_LABELS,
} from "@/domain/entities/ReminderCategory";
import { cn } from "@/lib/utils";

const BASIC_MODE_CATEGORIES: ReminderCategory[] = [
  "medication",
  "appointment",
];

export type ReminderFilterSelection =
  | { kind: "all" }
  | { kind: "today" }
  | { kind: "category"; category: ReminderCategory };

interface ReminderFilterPillsProps {
  value: ReminderFilterSelection;
  onChange: (next: ReminderFilterSelection) => void;
  isBasicMode?: boolean;
}

/**
 * Filtros exclusivos. Ordem: Todos → Hoje → categorias do schema/mobile.
 */
export function ReminderFilterPills({
  value,
  onChange,
  isBasicMode = false,
}: ReminderFilterPillsProps) {
  const categories = isBasicMode ? BASIC_MODE_CATEGORIES : REMINDER_CATEGORIES;

  return (
    <div
      className="flex flex-wrap gap-2"
      role="radiogroup"
      aria-label="Filtros de lembretes"
    >
      <FilterPill
        label="Todos"
        active={value.kind === "all"}
        onClick={() => onChange({ kind: "all" })}
      />
      <FilterPill
        label="Hoje"
        active={value.kind === "today"}
        onClick={() => onChange({ kind: "today" })}
      />
      {categories.map((category) => {
        const active =
          value.kind === "category" && value.category === category;
        return (
          <FilterPill
            key={category}
            label={REMINDER_CATEGORY_LABELS[category]}
            active={active}
            onClick={() => onChange({ kind: "category", category })}
          />
        );
      })}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "min-h-11 shrink-0 cursor-pointer rounded-[14px] border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export function useReminderListFilter(
  initial: ReminderFilterSelection = { kind: "all" },
) {
  const [filter, setFilter] = useState<ReminderFilterSelection>(initial);
  return { filter, setFilter };
}

export function matchesReminderFilter(
  reminder: { category: ReminderCategory; scheduledAt: Date | string },
  filter: ReminderFilterSelection,
  isToday: (scheduledAt: Date | string) => boolean,
): boolean {
  if (filter.kind === "all") return true;
  if (filter.kind === "today") return isToday(reminder.scheduledAt);
  return reminder.category === filter.category;
}
