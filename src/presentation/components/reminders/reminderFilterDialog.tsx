"use client";

import { useState } from "react";
import type { ReminderCategory } from "@/domain/entities/ReminderCategory";
import {
  REMINDER_CATEGORIES,
  REMINDER_CATEGORY_LABELS,
} from "@/domain/entities/ReminderCategory";
import {
  BASIC_MODE_REMINDER_CATEGORIES,
  EMPTY_REMINDER_LIST_FILTER,
  isReminderListFilterActive,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { cn } from "@/lib/utils";

type ReminderFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: ReminderListFilter;
  onApply: (next: ReminderListFilter) => void;
  isBasicMode?: boolean;
};

/**
 * Remonta o conteúdo ao abrir para sincronizar o rascunho com `value`,
 * sem setState dentro de useEffect (regra react-hooks/set-state-in-effect).
 */
export function ReminderFilterDialog({
  open,
  onOpenChange,
  value,
  onApply,
  isBasicMode = false,
}: ReminderFilterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <ReminderFilterDialogContent
          key={`${value.today}-${value.category ?? "none"}`}
          value={value}
          onApply={onApply}
          onOpenChange={onOpenChange}
          isBasicMode={isBasicMode}
        />
      ) : null}
    </Dialog>
  );
}

function ReminderFilterDialogContent({
  value,
  onApply,
  onOpenChange,
  isBasicMode = false,
}: Omit<ReminderFilterDialogProps, "open">) {
  const [tempToday, setTempToday] = useState(value.today);
  const [tempCategory, setTempCategory] = useState<ReminderCategory | null>(
    value.category,
  );

  const categories = isBasicMode
    ? BASIC_MODE_REMINDER_CATEGORIES
    : REMINDER_CATEGORIES;

  const tempFilter: ReminderListFilter = {
    today: tempToday,
    category: tempCategory,
  };
  const hasTempFilters = isReminderListFilterActive(tempFilter);

  return (
    <DialogContent
      className="max-h-[80vh] overflow-y-auto"
      showCloseButton={false}
    >
      <DialogHeader className="flex flex-row items-center justify-between space-y-0">
        <DialogTitle>Filtrar Lembretes</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Data</h3>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-input p-3 transition-colors hover:border-primary/50">
            <input
              type="checkbox"
              checked={tempToday}
              onChange={(e) => setTempToday(e.target.checked)}
              className="size-4 cursor-pointer"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Lembretes de hoje</div>
              <div className="text-xs text-muted-foreground">
                Mostrar apenas lembretes agendados para hoje
              </div>
            </div>
          </label>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Categoria</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setTempCategory(tempCategory === category ? null : category)
                }
                className={cn(
                  "min-h-11 cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  tempCategory === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-muted-foreground hover:border-primary/50",
                )}
              >
                {REMINDER_CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t pt-4">
        {hasTempFilters && (
          <button
            type="button"
            onClick={() => {
              setTempToday(false);
              setTempCategory(null);
            }}
            className="w-full cursor-pointer py-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Limpar Filtros
          </button>
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 flex-1 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="min-h-11 flex-1 cursor-pointer"
            onClick={() => {
              onApply(
                hasTempFilters ? tempFilter : EMPTY_REMINDER_LIST_FILTER,
              );
              onOpenChange(false);
            }}
          >
            {hasTempFilters ? "Aplicar Filtros" : "Mostrar Tudo"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
