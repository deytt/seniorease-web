import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { ReminderFilterDialog } from "@/presentation/components/reminders/reminderFilterDialog";
import { ReminderCard } from "@/presentation/components/reminders/reminderCard";
import { Button } from "@/presentation/components/ui/button";
import {
  EMPTY_REMINDER_LIST_FILTER,
  isReminderListFilterActive,
  matchesReminderListFilter,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { isReminderToday } from "@/presentation/components/reminders/reminderVisuals";
import { REMINDER_CATEGORY_LABELS } from "@/domain/entities/ReminderCategory";
import type { Reminder } from "@/domain/entities/Reminder";

/**
 * Demonstração integrada da página `/reminders` com filtro modal combinável,
 * cards e ações.
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
          "Demonstração integrada da página de Lembretes com filtros combináveis, cards e ações.",
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
    scheduledAt: new Date(Date.now() + 3600000),
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
    scheduledAt: new Date(Date.now() + 7200000),
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
    EMPTY_REMINDER_LIST_FILTER,
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [reminders, setReminders] = useState(mockReminders);

  const filteredReminders = reminders.filter((reminder) =>
    matchesReminderListFilter(reminder, filter, isReminderToday),
  );

  const filterActive = isReminderListFilterActive(filter);

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
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 cursor-pointer rounded-[14px]"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="mr-2 size-4" aria-hidden />
            Filtrar
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

      <ReminderFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        value={filter}
        onApply={setFilter}
      />

      {filterActive && (
        <p className="text-sm text-muted-foreground">
          Filtrando por:{" "}
          {[
            filter.today ? "Hoje" : null,
            filter.category
              ? REMINDER_CATEGORY_LABELS[filter.category]
              : null,
          ]
            .filter(Boolean)
            .join(" + ")}{" "}
          — {filteredReminders.length} de {reminders.length}
        </p>
      )}

      <div className="space-y-3 border-t pt-6">
        {filteredReminders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {filterActive
                ? "Nenhum lembrete encontrado para este filtro"
                : "Nenhum lembrete criado ainda"}
            </p>
            {filterActive && (
              <Button
                variant="outline"
                className="mt-4 cursor-pointer rounded-[14px]"
                onClick={() => setFilter(EMPTY_REMINDER_LIST_FILTER)}
              >
                Ver Todos
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
              showDate={!filter.today}
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 border-t pt-6">
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold">
            {reminders.filter((r) => !r.isRead).length}
          </p>
          <p className="text-xs text-muted-foreground">Pendentes</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold">
            {reminders.filter((r) => r.isRead).length}
          </p>
          <p className="text-xs text-muted-foreground">Concluídos</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold">{reminders.length}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <ReminderListIntegration />,
};

export const ManyReminders: Story = {
  render: () => {
    const manyReminders = Array.from({ length: 12 }).flatMap(
      () => mockReminders,
    );

    return (
      <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Lembretes (Simulação com 60)</h1>
          <p className="mt-1 text-muted-foreground">
            Mostrando comportamento com muitos lembretes
          </p>
        </div>
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {manyReminders.slice(0, 12).map((reminder, i) => (
            <ReminderCard
              key={`${reminder.id}-${i}`}
              reminder={reminder}
              onMarkDone={(id) => console.log("Mark done:", id)}
              onEdit={(r) => console.log("Edit:", r.title)}
              onDelete={(r) => console.log("Delete:", r.title)}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lembretes</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie seus lembretes e compromissos
          </p>
        </div>
        <Button className="cursor-pointer rounded-[14px]">
          <Plus className="mr-2 size-4" aria-hidden />
          Novo Lembrete
        </Button>
      </div>

      <div className="border-t py-12 text-center">
        <p className="mb-4 text-muted-foreground">
          Você ainda não tem nenhum lembrete criado
        </p>
        <Button variant="default" className="cursor-pointer rounded-[14px]">
          Criar Primeiro Lembrete
        </Button>
      </div>
    </div>
  ),
};
