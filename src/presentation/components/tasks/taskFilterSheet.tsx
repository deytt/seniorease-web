"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check } from "lucide-react";
import type { TaskCategory, TaskPriority } from "@/domain/entities/Task";
import {
  EMPTY_TASK_LIST_FILTER,
  isTaskListFilterEmpty,
  TASK_FILTER_CATEGORIES,
  TASK_FILTER_PRIORITIES,
  TASK_PRIORITY_LABELS,
  taskCategoryLabel,
  type TaskListFilter,
} from "@/presentation/components/tasks/taskFilter";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { cn } from "@/lib/utils";

type TaskFilterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilter: TaskListFilter;
  onApply: (filter: TaskListFilter) => void;
};

/**
 * Modal de filtros — mesma ideia do `ReminderFilterSheet`:
 * Data (Hoje) + Categoria + Prioridade (Modo Avançado), aplicar só no botão.
 */
export function TaskFilterSheet({
  open,
  onOpenChange,
  initialFilter,
  onApply,
}: TaskFilterSheetProps) {
  const [draft, setDraft] = useState<TaskListFilter>(initialFilter);

  useEffect(() => {
    if (open) setDraft(initialFilter);
  }, [open, initialFilter]);

  const toggleToday = () => {
    setDraft((prev) => ({ ...prev, isToday: !prev.isToday }));
  };

  const toggleCategory = (category: TaskCategory) => {
    setDraft((prev) => ({
      ...prev,
      category: prev.category === category ? null : category,
    }));
  };

  const togglePriority = (priority: TaskPriority) => {
    setDraft((prev) => ({
      ...prev,
      priority: prev.priority === priority ? null : priority,
    }));
  };

  const clearDraft = () => setDraft(EMPTY_TASK_LIST_FILTER);

  const apply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-modal sm:max-w-md"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-5 py-4">
          <DialogTitle className="font-sans text-lg font-bold normal-case tracking-normal">
            Filtrar Tarefas
          </DialogTitle>
          {!isTaskListFilterEmpty(draft) ? (
            <button
              type="button"
              onClick={clearDraft}
              className="min-h-11 cursor-pointer px-2 text-sm font-semibold text-primary"
            >
              Limpar
            </button>
          ) : null}
        </DialogHeader>

        <div className="max-h-[min(70vh,32rem)] space-y-6 overflow-y-auto px-5 py-5">
          <section>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Data
            </p>
            <button
              type="button"
              onClick={toggleToday}
              aria-pressed={draft.isToday}
              className={cn(
                "flex w-full min-h-14 cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-3 text-left transition-colors",
                draft.isToday
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted/30 text-foreground hover:border-primary/40",
              )}
            >
              <CalendarDays
                className={cn(
                  "size-5 shrink-0",
                  draft.isToday
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-base font-semibold",
                    draft.isToday
                      ? "text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  Tarefas de Hoje
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-sm",
                    draft.isToday
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  Mostrar apenas tarefas agendadas para hoje
                </span>
              </span>
              {draft.isToday ? (
                <Check
                  className="size-5 shrink-0 text-primary-foreground"
                  aria-hidden
                />
              ) : null}
            </button>
          </section>

          <section>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Categoria
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Categoria">
              {TASK_FILTER_CATEGORIES.map((category) => {
                const selected = draft.category === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "min-h-11 cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {taskCategoryLabel(category)}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="advanced-only">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Prioridade
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Prioridade"
            >
              {TASK_FILTER_PRIORITIES.map((priority) => {
                const selected = draft.priority === priority;
                return (
                  <button
                    key={priority}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => togglePriority(priority)}
                    className={cn(
                      "min-h-11 min-w-[5.5rem] flex-1 cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {TASK_PRIORITY_LABELS[priority]}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <DialogFooter className="gap-3 border-t border-border px-5 py-4 sm:justify-stretch">
          <Button
            type="button"
            variant="outline"
            className="min-h-12 flex-1 cursor-pointer rounded-[14px]"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="min-h-12 flex-1 cursor-pointer rounded-[14px]"
            onClick={apply}
          >
            {isTaskListFilterEmpty(draft) ? "Mostrar Tudo" : "Aplicar Filtros"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
