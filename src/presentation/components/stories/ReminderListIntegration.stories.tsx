import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { ReminderActiveFilterBar } from "@/presentation/components/reminders/reminderActiveFilterBar";
import { ReminderFilterSheet } from "@/presentation/components/reminders/reminderFilterSheet";
import { ReminderCard } from "@/presentation/components/reminders/reminderCard";
import { Button } from "@/presentation/components/ui/button";
import {
  DEFAULT_REMINDER_LIST_FILTER,
  EMPTY_REMINDER_LIST_FILTER,
  isReminderListFilterEmpty,
  matchesReminderListFilter,
  reminderListFilterActiveCount,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { isReminderToday } from "@/presentation/components/reminders/reminderVisuals";
import type { Reminder } from "@/domain/entities/Reminder";

/**
 * Demonstração integrada da página `/reminders` com filtros do mobile.
 */
const meta = {
  title: "Integrations/ReminderListPage",
  component: () => <div>ReminderListPage Integration</div>,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Demonstração integrada da página de Lembretes com modal de filtros (Hoje + categoria) e hora 24h.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockReminders: Reminder[] = [
  {
    id: "reminder-1",
    userId: "user-123",
    title: "Tomar medicação - Hipertensão",
    message: "Comprimido azul com água após café da manhã",
    category: "medication",
    scheduledAt: new Date(),
    isRead: false,
    notified: false,
    createdAt: new Date(),
  },
  {
    id: "reminder-2",
    userId: "user-123",
    title: "Beber água",
    message: "Hidratação é importante",
    category: "hydration",
    scheduledAt: new Date(),
    isRead: false,
    notified: false,
    createdAt: new Date(),
  },
  {
    id: "reminder-3",
    userId: "user-123",
    title: "Consulta com Dr. Silva",
    message: "Consultório no bairro da Consolação",
    category: "appointment",
    scheduledAt: new Date(Date.now() + 86400000),
    isRead: false,
    notified: false,
    createdAt: new Date(),
  },
  {
    id: "reminder-4",
    userId: "user-123",
    title: "Almoço com a família",
    message: "Restaurante italiano às 12h30",
    category: "meal",
    scheduledAt: new Date(Date.now() + 10800000),
    isRead: false,
    notified: false,
    createdAt: new Date(),
  },
  {
    id: "reminder-5",
    userId: "user-123",
    title: "Pagar conta de energia",
    message: "Boleto vence dia 15",
    category: "bills",
    scheduledAt: new Date(Date.now() + 432000000),
    isRead: true,
    notified: false,
    createdAt: new Date(),
  },
];

const ReminderListIntegration = () => {
  const [filter, setFilter] = useState<ReminderListFilter>(
    DEFAULT_REMINDER_LIST_FILTER,
  );
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState(mockReminders);
  const count = reminderListFilterActiveCount(filter);

  const filteredReminders = reminders.filter((reminder) =>
    matchesReminderListFilter(reminder, filter, isReminderToday),
  );

  const handleMarkDone = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, isRead: true } : r)),
    );
  };

  const handleDelete = (reminder: Reminder) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminder.id));
  };

  const handleEdit = (reminder: Reminder) => {
    console.log(`Editar: ${reminder.title}`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Lembretes</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie seus lembretes e compromissos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
          <Button
            className="min-h-11 cursor-pointer rounded-[14px]"
            onClick={() => console.log("Navegar para /reminders/create")}
          >
            <Plus className="mr-2 size-4" aria-hidden />
            Novo Lembrete
          </Button>
        </div>
      </div>

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
      ) : null}

      <p className="text-sm text-muted-foreground">
        {filteredReminders.length} de {reminders.length} lembretes
      </p>

      <div className="space-y-3 border-t pt-6">
        {filteredReminders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum lembrete com estes filtros
            </p>
            {!isReminderListFilterEmpty(filter) ? (
              <Button
                variant="outline"
                className="mt-4 cursor-pointer rounded-[14px]"
                onClick={() => setFilter(EMPTY_REMINDER_LIST_FILTER)}
              >
                Mostrar todos os lembretes
              </Button>
            ) : null}
          </div>
        ) : (
          filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onMarkDone={handleMarkDone}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <ReminderFilterSheet
        open={open}
        onOpenChange={setOpen}
        initialFilter={filter}
        onApply={setFilter}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <ReminderListIntegration />,
};
