import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Filter } from "lucide-react";
import { ReminderFilterDialog } from "@/presentation/components/reminders/reminderFilterDialog";
import {
  EMPTY_REMINDER_LIST_FILTER,
  isReminderListFilterActive,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { Button } from "@/presentation/components/ui/button";
import { REMINDER_CATEGORY_LABELS } from "@/domain/entities/ReminderCategory";

/**
 * Modal de filtros combináveis para a lista de lembretes (Hoje + categoria),
 * alinhado ao padrão da lista de Tarefas e ao mobile.
 */
const meta = {
  title: "Features/ReminderFilterDialog",
  component: ReminderFilterDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Filtro combinável de lembretes: Hoje e categoria podem ser usados juntos. Em Modo Básico só Medicação e Consulta.",
      },
    },
  },
} satisfies Meta<typeof ReminderFilterDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function FilterDemo({ isBasicMode = false }: { isBasicMode?: boolean }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<ReminderListFilter>(
    EMPTY_REMINDER_LIST_FILTER,
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <Button
        type="button"
        variant="outline"
        className="min-h-11 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Filter className="size-4" aria-hidden />
        Filtrar
      </Button>
      <p className="text-sm text-muted-foreground">
        Ativo:{" "}
        <span className="font-bold">
          {!isReminderListFilterActive(filter)
            ? "Nenhum"
            : [
                filter.today ? "Hoje" : null,
                filter.category
                  ? REMINDER_CATEGORY_LABELS[filter.category]
                  : null,
              ]
                .filter(Boolean)
                .join(" + ")}
        </span>
      </p>
      <ReminderFilterDialog
        open={open}
        onOpenChange={setOpen}
        value={filter}
        onApply={setFilter}
        isBasicMode={isBasicMode}
      />
    </div>
  );
}

export const Default: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    value: EMPTY_REMINDER_LIST_FILTER,
    onApply: () => {},
  },
  render: () => <FilterDemo />,
};

export const BasicMode: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    value: EMPTY_REMINDER_LIST_FILTER,
    onApply: () => {},
  },
  render: () => <FilterDemo isBasicMode />,
};

export const WithActiveFilters: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    value: { today: true, category: "medication" },
    onApply: () => {},
  },
  render: () => {
    const [open, setOpen] = useState(true);
    const [filter, setFilter] = useState<ReminderListFilter>({
      today: true,
      category: "medication",
    });

    return (
      <ReminderFilterDialog
        open={open}
        onOpenChange={setOpen}
        value={filter}
        onApply={setFilter}
      />
    );
  },
};
