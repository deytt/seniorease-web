import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { ReminderFilterChips } from "@/presentation/components/reminders/reminderFilterChips";
import {
  DEFAULT_REMINDER_LIST_FILTER,
  REMINDER_LIST_FILTER_OPTIONS,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";

/**
 * Chips exclusivos de filtro da lista de lembretes (paridade mobile).
 */
const meta = {
  title: "Features/ReminderFilterChips",
  component: ReminderFilterChips,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Filtro exclusivo: Hoje, Medicação ou Consultas. Um chip ativo por vez; padrão Hoje.",
      },
    },
  },
} satisfies Meta<typeof ReminderFilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

function ChipsDemo({
  initial = DEFAULT_REMINDER_LIST_FILTER,
}: {
  initial?: ReminderListFilter;
}) {
  const [filter, setFilter] = useState<ReminderListFilter>(initial);
  const label =
    REMINDER_LIST_FILTER_OPTIONS.find((option) => option.id === filter)
      ?.label ?? filter;

  return (
    <div className="w-full max-w-md space-y-4">
      <ReminderFilterChips value={filter} onChange={setFilter} />
      <p className="text-sm text-muted-foreground">
        Ativo: <span className="font-bold">{label}</span>
      </p>
    </div>
  );
}

export const Default: Story = {
  args: {
    value: DEFAULT_REMINDER_LIST_FILTER,
    onChange: () => {},
  },
  render: () => <ChipsDemo />,
};

export const MedicationSelected: Story = {
  args: {
    value: "medication",
    onChange: () => {},
  },
  render: () => <ChipsDemo initial="medication" />,
};
