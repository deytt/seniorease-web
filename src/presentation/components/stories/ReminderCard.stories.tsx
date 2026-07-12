import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ReminderCard } from "@/presentation/components/reminders/reminderCard";
import type { Reminder } from "@/domain/entities/Reminder";

/**
 * `ReminderCard` é o card responsivo que exibe um lembrete individual.
 * Adapta-se automaticamente a diferentes tamanhos de tela e gerencia
 * ações de conclusão, edição e exclusão.
 *
 * ## Layout Responsivo
 * - **Mobile (<sm)**: conteúdo + ações empilhadas em duas linhas
 * - **Tablet (sm-xl)**: similar ao mobile
 * - **Desktop (xl+)**: conteúdo à esquerda, ações à direita em uma linha
 * - Texto truncado adapta-se com breakpoints para diferentes limites de caracteres
 *
 * ## Estados
 * - **Pendente**: fundo branco, texto normal, botões ativos
 * - **Concluído** (isRead=true): fundo cinzento, texto com strikethrough, sem ações
 *
 * ## Ações Disponíveis
 * - `onMarkDone`: marca como concluído (não reciclável)
 * - `onEdit`: abre modal de edição
 * - `onDelete`: abre confirmação de exclusão
 *
 * ## Acessibilidade
 * - aria-label descritivo incluindo hora e período
 * - Ícones com aria-hidden (redundante com texto)
 * - Labels em botões de ação para leitores de tela
 *
 * ## Caso de Uso
 * Usado em `/reminders` para listar todos os lembretes do usuário,
 * com filtros combináveis (hoje, categoria) e ações inline.
 */
const meta = {
  title: "Features/ReminderCard",
  component: ReminderCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card responsivo para exibir um lembrete com ações inline (marcar concluído, editar, deletar). Adapta-se a mobile, tablet e desktop.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: "800px", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReminderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockReminderPending: Reminder = {
  id: "reminder-1",
  userId: "user-123",
  title: "Tomar medicação",
  message: "Tomar comprimido azul com água após café da manhã",
  category: "medication",
  scheduledAt: new Date(Date.now() + 3600000), // 1 hora
  isRead: false,
  createdAt: new Date(),
  taskId: null,
};

const mockReminderCompleted: Reminder = {
  ...mockReminderPending,
  id: "reminder-2",
  isRead: true,
};

const mockReminderLongText: Reminder = {
  ...mockReminderPending,
  id: "reminder-3",
  title: "Consulta com o Dr. Silva - Dermatologia",
  message:
    "Não esquecer de trazer a carteira de saúde e o documento de identidade. Consulta às 14h30.",
};

/**
 * Card padrão: lembrete pendente com hora próxima.
 * Mostra todas as ações disponíveis.
 */
export const Default: Story = {
  args: {
    reminder: mockReminderPending,
    onMarkDone: (id) => console.log(`✅ Marcar como concluído: ${id}`),
    onEdit: (reminder) => console.log(`✏️ Editar: ${reminder.title}`),
    onDelete: (reminder) => console.log(`🗑️ Deletar: ${reminder.title}`),
  },
  render: (args) => <ReminderCard {...args} />,
};

/**
 * Card concluído: mostra estado visual diferente (fundo cinzento,
 * texto em strikethrough) e desativa ações.
 */
export const Completed: Story = {
  args: {
    reminder: mockReminderCompleted,
    onMarkDone: (id) => console.log(`✅ Marcar como concluído: ${id}`),
    onEdit: (reminder) => console.log(`✏️ Editar: ${reminder.title}`),
    onDelete: (reminder) => console.log(`🗑️ Deletar: ${reminder.title}`),
  },
  render: (args) => <ReminderCard {...args} />,
};

/**
 * Com opção de mostrar data: útil em listagens que abrangem múltiplos dias
 * ou quando o contexto de data não é óbvio.
 */
export const WithDate: Story = {
  args: {
    reminder: mockReminderPending,
    showDate: true,
    onMarkDone: (id) => console.log(`✅ Marcar como concluído: ${id}`),
    onEdit: (reminder) => console.log(`✏️ Editar: ${reminder.title}`),
    onDelete: (reminder) => console.log(`🗑️ Deletar: ${reminder.title}`),
  },
  render: (args) => <ReminderCard {...args} />,
};

/**
 * Texto longo: demonstra truncamento responsivo.
 * O texto se adapta baseado no breakpoint (default < sm < lg < xl).
 */
export const LongText: Story = {
  args: {
    reminder: mockReminderLongText,
    onMarkDone: (id) => console.log(`✅ Marcar como concluído: ${id}`),
    onEdit: (reminder) => console.log(`✏️ Editar: ${reminder.title}`),
    onDelete: (reminder) => console.log(`🗑️ Deletar: ${reminder.title}`),
  },
  render: (args) => <ReminderCard {...args} />,
};

/**
 * Sem ações: card apenas para visualização (read-only).
 * Útil quando o contexto não permite edição.
 */
export const ReadOnly: Story = {
  args: {
    reminder: mockReminderPending,
  },
  render: (args) => <ReminderCard {...args} />,
};

/**
 * Apenas ação de exclusão: cenário onde pode-se deletar mas não editar.
 */
export const DeleteOnly: Story = {
  args: {
    reminder: mockReminderPending,
    onDelete: (reminder) => console.log(`🗑️ Deletar: ${reminder.title}`),
  },
  render: (args) => <ReminderCard {...args} />,
};
