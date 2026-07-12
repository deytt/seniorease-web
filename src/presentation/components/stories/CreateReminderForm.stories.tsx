import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { CreateReminderForm } from "@/presentation/components/reminders/createReminderForm";
import type { Reminder } from "@/domain/entities/Reminder";

/**
 * `CreateReminderForm` é o formulário para criar e editar lembretes no SeniorEase.
 * Suporta tanto criação de novo lembrete quanto edição de um existente.
 *
 * ## Campos & Validações
 * - **Título** (obrigatório): máx 30 caracteres
 * - **Mensagem** (obrigatório): máx 200 caracteres
 * - **Categoria** (obrigatório): medication, appointment, hydration, meal, bills
 *   - Em modo básico: apenas medication, appointment
 * - **Data & Hora Agendada** (obrigatório): type="datetime-local", valida data no futuro
 *
 * ## Modos de Operação
 * - **Criação**: sem prop `initial` — cria novo lembrete
 * - **Edição**: com prop `initial={reminder}` — atualiza lembrete existente
 *
 * ## Acessibilidade
 * - Labels explícitos obrigatórios
 * - Validação em tempo real com mensagens claras
 * - Suporte a modo interface básica (menos opções de categoria)
 * - Delay intencional no submit (UX feedback)
 *
 * ## Caso de Uso
 * - `/reminders/create` — criar novo lembrete
 * - `/reminders/[id]/edit` — editar lembrete existente
 */
const meta = {
  title: "Features/CreateReminderForm",
  component: CreateReminderForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Formulário para criar e editar lembretes com validação, modo básico e integração com Firebase.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: "600px", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CreateReminderForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Formulário vazio para criar novo lembrete.
 * Mostra todos os campos com valores padrão:
 * - Categoria: "medication"
 * - Data/hora: vazia
 */
export const CreateNew: Story = {
  args: {
    onSuccess: () => console.log("✅ Lembrete criado!"),
  },
  render: (args) => <CreateReminderForm {...args} />,
};

/**
 * Modo de edição: form pré-preenchido com dados de um lembrete existente.
 * Observe que o título do formulário e botão de submit mudam para "Atualizar".
 */
export const EditExisting: Story = {
  args: {
    initial: {
      id: "reminder-123",
      userId: "user-456",
      title: "Tomar medicação",
      message: "Tomar comprimido azul com água",
      category: "medication",
      scheduledAt: new Date(Date.now() + 3600000), // 1 hora no futuro
      isRead: false,
      createdAt: new Date(),
      taskId: null,
    } as Reminder,
    onSuccess: () => console.log("✅ Lembrete atualizado!"),
  },
  render: (args) => <CreateReminderForm {...args} />,
};

/**
 * Demonstra o comportamento com callbacks de sucesso.
 * Útil para logs, redirecionamento ou toast notifications.
 */
export const WithCallbacks: Story = {
  args: {
    onSuccess: () => {
      console.log("🎉 Success callback fired!");
      console.log("📍 Can redirect to /reminders or show toast");
    },
  },
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm text-amber-600 border border-amber-200 bg-amber-50 p-3 rounded-lg">
        Abra o console para ver callbacks de sucesso
      </p>
      <CreateReminderForm {...args} />
    </div>
  ),
};
