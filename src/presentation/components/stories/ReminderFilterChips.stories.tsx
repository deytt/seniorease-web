import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Filter } from "lucide-react";
import { ReminderActiveFilterBar } from "@/presentation/components/reminders/reminderActiveFilterBar";
import { ReminderFilterSheet } from "@/presentation/components/reminders/reminderFilterSheet";
import {
  DEFAULT_REMINDER_LIST_FILTER,
  isReminderListFilterEmpty,
  reminderListFilterActiveCount,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { Button } from "@/presentation/components/ui/button";

/**
 * Filtros da lista de lembretes — modal + chips ativos (paridade mobile).
 */
const meta = {
  title: "Features/ReminderFilters",
  component: ReminderActiveFilterBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Botão Filtrar abre o modal (Hoje + categorias). Chips ativos removem filtros individualmente.",
      },
    },
  },
} satisfies Meta<typeof ReminderActiveFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function FiltersDemo({
  initial = DEFAULT_REMINDER_LIST_FILTER,
}: {
  initial?: ReminderListFilter;
}) {
  const [filter, setFilter] = useState<ReminderListFilter>(initial);
  const [open, setOpen] = useState(false);
  const count = reminderListFilterActiveCount(filter);

  return (
    <div className="w-full max-w-md space-y-4">
      <Button
        type="button"
        variant="outline"
        className="relative min-h-11 cursor-pointer rounded-[14px]"
        onClick={() => setOpen(true)}
      >
        <Filter className="size-4" aria-hidden />
        Filtrar
        {count > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {count}
          </span>
        ) : null}
      </Button>

      {!isReminderListFilterEmpty(filter) ? (
        <ReminderActiveFilterBar
          filter={filter}
          onRemoveToday={() =>
            setFilter((prev) => ({ ...prev, isToday: false }))
          }
          onRemoveCategory={() =>
            setFilter((prev) => ({ ...prev, category: null }))
          }
        />
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum filtro ativo</p>
      )}

      <ReminderFilterSheet
        open={open}
        onOpenChange={setOpen}
        initialFilter={filter}
        onApply={setFilter}
      />
    </div>
  );
}

export const Default: Story = {
  args: {
    filter: DEFAULT_REMINDER_LIST_FILTER,
    onRemoveToday: () => {},
    onRemoveCategory: () => {},
  },
  render: () => <FiltersDemo />,
};

export const TodayAndMedication: Story = {
  args: {
    filter: { isToday: true, category: "medication" },
    onRemoveToday: () => {},
    onRemoveCategory: () => {},
  },
  render: () => (
    <FiltersDemo initial={{ isToday: true, category: "medication" }} />
  ),
};
