import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { ReminderFilterPills } from "@/presentation/components/reminders/reminderFilterPills";
import { ReminderCard } from "@/presentation/components/reminders/reminderCard";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import type { ReminderFilterSelection } from "@/presentation/components/reminders/reminderFilterPills";
import type { Reminder } from "@/domain/entities/Reminder";

/**
 * Demonstração integrada da página `/reminders` com múltiplos componentes
 * funcionando juntos: filtros, cards, e ações.
 *
 * ## Componentes Integrados
 * - `ReminderFilterPills`: filtros exclusivos (Todos, Hoje, Categorias)
 * - `ReminderCard`: exibe cada lembrete individual
 * - `Button`: ação de criar novo lembrete
 *
 * ## Fluxo
 * 1. Usuário seleciona um filtro
 * 2. Lista filtra e reexibe cards correspondentes
 * 3. Usuário interage com cards (concluir, editar, deletar)
 * 4. Botão "Criar" navega para `/reminders/create`
 *
 * ## Estado Vazio
 * Mostra mensagem amigável quando nenhum lembrete corresponde ao filtro.
 *
 * ## Responsividade
 * - Mobile: layout vertical com filtros em wrap
 * - Desktop: layout com filtros em linha e cards lado a lado
 *
 * ## Caso de Uso
 * Demonstração visual de como a página de Lembretes completa funciona
 * com filtros e interações em tempo real.
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
          "Demonstração integrada da página de Lembretes com filtros, cards e ações.",
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
    scheduledAt: new Date(Date.now() + 3600000), // 1 hora
    isRead: false,
    createdAt: new Date(),
    taskId: null,
  },
  {
    id: "reminder-2",
    userId: "user-123",
    title: "Beber água",
    message: "Hidratação é importante",
    category: "hydration",
    scheduledAt: new Date(Date.now() + 7200000), // 2 horas
    isRead: false,
    createdAt: new Date(),
    taskId: null,
  },
  {
    id: "reminder-3",
    userId: "user-123",
    title: "Consulta com Dr. Silva",
    message: "Consultório no bairro da Consolação",
    category: "appointment",
    scheduledAt: new Date(Date.now() + 86400000), // amanhã
    isRead: false,
    createdAt: new Date(),
    taskId: null,
  },
  {
    id: "reminder-4",
    userId: "user-123",
    title: "Almoço com a família",
    message: "Restaurante italiano às 12h30",
    category: "meal",
    scheduledAt: new Date(Date.now() + 10800000), // 3 horas
    isRead: false,
    createdAt: new Date(),
    taskId: null,
  },
  {
    id: "reminder-5",
    userId: "user-123",
    title: "Pagar conta de energia",
    message: "Boleto vence dia 15",
    category: "bills",
    scheduledAt: new Date(Date.now() + 432000000), // 5 dias
    isRead: true, // concluído
    createdAt: new Date(),
    taskId: null,
  },
];

const ReminderListIntegration = () => {
  const [filter, setFilter] = useState<ReminderFilterSelection>({
    kind: "all",
  });
  const [reminders, setReminders] = useState(mockReminders);

  // Filtrar lembretes
  const filteredReminders = reminders.filter((reminder) => {
    if (filter.kind === "all") return true;
    if (filter.kind === "today") {
      const today = new Date();
      const reminderDate = new Date(reminder.scheduledAt);
      return (
        reminderDate.toDateString() === today.toDateString() && !reminder.isRead
      );
    }
    if (filter.kind === "category") {
      return reminder.category === filter.category && !reminder.isRead;
    }
    return true;
  });

  const handleMarkDone = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, isRead: true } : r)),
    );
    console.log(`✅ Lembrete ${reminderId} marcado como concluído`);
  };

  const handleDelete = (reminder: Reminder) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminder.id));
    console.log(`🗑️ Lembrete ${reminder.title} deletado`);
  };

  const handleEdit = (reminder: Reminder) => {
    console.log(`✏️ Editar: ${reminder.title}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lembretes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus lembretes e compromissos
          </p>
        </div>
        <Button
          className="cursor-pointer rounded-[14px]"
          onClick={() => console.log("Navegar para /reminders/create")}
        >
          <Plus className="size-4 mr-2" aria-hidden />
          Novo Lembrete
        </Button>
      </div>

      {/* Filtros */}
      <div className="border-t pt-6">
        <p className="text-sm font-semibold mb-3">Filtrar por:</p>
        <ReminderFilterPills value={filter} onChange={setFilter} />
        <p className="text-xs text-muted-foreground mt-2">
          Mostrando {filteredReminders.length} de {reminders.length} lembrete
          {reminders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Lista */}
      <div className="border-t pt-6 space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {filter.kind === "all"
                ? "Nenhum lembrete criado ainda"
                : "Nenhum lembrete encontrado para este filtro"}
            </p>
            <Button
              variant="outline"
              className="mt-4 cursor-pointer rounded-[14px]"
              onClick={() => {
                setFilter({ kind: "all" });
                console.log("Voltar para Todos");
              }}
            >
              Ver Todos
            </Button>
          </div>
        ) : (
          filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onMarkDone={handleMarkDone}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showDate={filter.kind === "all"} // mostra data se filtro é "todos"
            />
          ))
        )}
      </div>

      {/* Estatísticas */}
      <div className="border-t pt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold">
            {reminders.filter((r) => !r.isRead).length}
          </p>
          <p className="text-xs text-muted-foreground">Pendentes</p>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold">
            {reminders.filter((r) => r.isRead).length}
          </p>
          <p className="text-xs text-muted-foreground">Concluídos</p>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold">{reminders.length}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Demonstração completa da página de Lembretes com todos os
 * componentes integrados e funcionando interativamente.
 */
export const Default: Story = {
  render: () => <ReminderListIntegration />,
};

/**
 * Modo com muitos lembretes: demonstra scroll e layout em série.
 */
export const ManyReminders: Story = {
  render: () => {
    // Duplicar lembretes para simular lista grande
    const manyReminders = Array.from({ length: 12 }).flatMap(
      () => mockReminders,
    );

    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lembretes (Simulação com 60)</h1>
          <p className="text-muted-foreground mt-1">
            Mostrando comportamento com muitos lembretes
          </p>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
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

/**
 * Estado vazio: nenhum lembrete criado.
 */
export const Empty: Story = {
  render: () => (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lembretes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus lembretes e compromissos
          </p>
        </div>
        <Button className="cursor-pointer rounded-[14px]">
          <Plus className="size-4 mr-2" aria-hidden />
          Novo Lembrete
        </Button>
      </div>

      <div className="border-t pt-6 text-center py-12">
        <p className="text-muted-foreground mb-4">
          Você ainda não tem nenhum lembrete criado
        </p>
        <Button variant="default" className="cursor-pointer rounded-[14px]">
          Criar Primeiro Lembrete
        </Button>
      </div>
    </div>
  ),
};
