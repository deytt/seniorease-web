import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ReminderFilterChips } from "@/presentation/components/reminders/reminderFilterChips";
import { ReminderCard } from "@/presentation/components/reminders/reminderCard";
import { Button } from "@/presentation/components/ui/button";
import {
  DEFAULT_REMINDER_LIST_FILTER,
  REMINDER_LIST_FILTER_OPTIONS,
  matchesReminderListFilter,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { isReminderToday } from "@/presentation/components/reminders/reminderVisuals";
import type { Reminder } from "@/domain/entities/Reminder";

/**
 * Demonstração integrada da página `/reminders` com chips exclusivos.
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
          "Demonstração integrada da página de Lembretes com filtros exclusivos (Hoje / Medicação / Consultas).",
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
  const [reminders, setReminders] = useState(mockReminders);

  const filteredReminders = reminders.filter((reminder) =>
    matchesReminderListFilter(reminder, filter, isReminderToday),
  );

  const activeLabel =
    REMINDER_LIST_FILTER_OPTIONS.find((option) => option.id === filter)
      ?.label ?? filter;

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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Lembretes</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie seus lembretes e compromissos
          </p>
        </div>
        <Button
          className="min-h-11 cursor-pointer rounded-[14px]"
          onClick={() => console.log("Navegar para /reminders/create")}
        >
          <Plus className="mr-2 size-4" aria-hidden />
          Novo Lembrete
        </Button>
      </div>

      <ReminderFilterChips value={filter} onChange={setFilter} />

      <p className="text-sm text-muted-foreground">
        Filtro ativo: <span className="font-bold">{activeLabel}</span> —{" "}
        {filteredReminders.length} de {reminders.length}
      </p>

      <div className="space-y-3 border-t pt-6">
        {filteredReminders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum lembrete encontrado para este filtro
            </p>
            {filter !== "today" && (
              <Button
                variant="outline"
                className="mt-4 cursor-pointer rounded-[14px]"
                onClick={() => setFilter("today")}
              >
                Ver lembretes de hoje
              </Button>
            )}
          </div>
        ) : (
          filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onMarkDone={handleMarkDone}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showDate={filter !== "today"}
            />
          ))
        )}
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <ReminderListIntegration />,
};
