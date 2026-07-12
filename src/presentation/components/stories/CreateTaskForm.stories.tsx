import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { CreateTaskForm } from "@/presentation/components/tasks/createTaskForm";

/**
 * `CreateTaskForm` é o formulário principal para criar novas tarefas no SeniorEase.
 * Inclui campos para título, descrição, data/hora, prioridade, categoria e passos
 * guiados (subtarefas).
 *
 * ## Campos & Validações
 * - **Título** (obrigatório): máx 30 caracteres com contador live
 * - **Descrição** (opcional): máx 100 caracteres com contador live
 * - **Data & Hora** (obrigatório): type="datetime-local", valida data no futuro
 * - **Prioridade**: low, medium, high (default: medium)
 * - **Categoria**: medication, health, exercise, social, personal (default: health)
 * - **Passos** (obrigatório, min 1): cada passo tem título + instrução
 *
 * ## Acessibilidade
 * - Campos com labels explícitos (sem depender de placeholder)
 * - Mensagens de validação em tempo real
 * - Indicadores de campo obrigatório
 * - Suporte a keyboard navigation (Tab, Enter)
 *
 * ## Caso de Uso
 * Usar em `/tasks/create` para permitir que usuários criem tarefas com estrutura
 * guiada. O formulário integra-se com DI container para usar `CreateTaskUseCase`
 * e salvar no Firebase.
 */
const meta = {
  title: "Features/CreateTaskForm",
  component: CreateTaskForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Formulário completo para criar tarefas com validação em tempo real, contadores de caracteres e passos guiados.",
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
} satisfies Meta<typeof CreateTaskForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Estado padrão: formulário vazio pronto para entrada de dados.
 * Mostra todos os campos com valores padrão:
 * - Prioridade: "medium"
 * - Categoria: "health"
 * - Sem passos adicionados ainda
 */
export const Default: Story = {
  args: {
    onSuccess: () => console.log("✅ Tarefa criada com sucesso!"),
  },
  render: (args) => <CreateTaskForm {...args} />,
};

/**
 * Com callback de sucesso customizado.
 * Útil para demonstrar o fluxo após criação (redirecionamento, toast, etc).
 */
export const WithSuccessCallback: Story = {
  args: {
    onSuccess: () => {
      console.log("✅ Task created!");
      console.log("📍 Redirecting to /tasks...");
    },
  },
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Abra o console para ver o callback de sucesso
      </p>
      <CreateTaskForm {...args} />
    </div>
  ),
};

/**
 * Referência para acesso programático ao formulário.
 * Útil quando o formulário está embarcado em um modal ou página complexa.
 */
export const WithFormRef: Story = {
  render: () => {
    const formRef = React.useRef<HTMLFormElement>(null);

    return (
      <div className="space-y-4">
        <CreateTaskForm
          formRef={formRef}
          onSuccess={() => console.log("Form submitted via ref!")}
        />
        <p className="text-xs text-muted-foreground">
          Use `formRef.current?.submit()` para submeter via code
        </p>
      </div>
    );
  },
};
