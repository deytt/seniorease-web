import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@/presentation/components/ui/badge";

/**
 * `Badge` identifica status, prioridade e categoria em toda a aplicação.
 * Existem dois grupos de variantes:
 *
 * - **Status** (`default`, `success`, `warning`, `destructive`, `secondary`,
 *   `purple`, `outline`): pill com fundo colorido claro e texto na cor
 *   correspondente mais saturada, para manter contraste suficiente (ex.:
 *   fundo `#f0fdf4` + texto `#22c55e` em `success`).
 * - **Counter** (`counter`, `counter-danger`, `counter-success`,
 *   `counter-secondary`): círculo sólido de 24px usado para contagens
 *   numéricas (ex.: número de tarefas, alertas).
 *
 * Referência: Figma → SeniorEase Design System → Badges & Labels (node 2:7760).
 *
 * ## Quando usar
 * - Use variantes de status para comunicar o estado de um item (Concluída,
 *   Em andamento, Urgente).
 * - Use variantes `counter` apenas para números pequenos (1–2 dígitos); para
 *   contagens maiores, prefira texto por extenso.
 * - `outline` é reservado para tags de categoria neutras (não usar para
 *   status que precisem de destaque de cor).
 */
const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "success",
        "warning",
        "destructive",
        "secondary",
        "purple",
        "outline",
        "counter",
        "counter-danger",
        "counter-success",
        "counter-secondary",
      ],
      description:
        "Estilo visual. Variantes de status são pills; variantes `counter-*` são círculos sólidos para números.",
      table: { defaultValue: { summary: "default" } },
    },
    asChild: {
      control: "boolean",
      description: "Repassa estilos ao elemento filho via Radix Slot.",
    },
  },
  args: {
    children: "Badge",
    variant: "default",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uso padrão. */
export const Default: Story = {};

/** Todas as variantes de status usadas para indicar situação de um item. */
export const StatusVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">In Progress</Badge>
      <Badge variant="destructive">High Priority</Badge>
      <Badge variant="secondary">Health</Badge>
      <Badge variant="default">Social</Badge>
      <Badge variant="purple">Scheduled</Badge>
      <Badge variant="outline">Category</Badge>
    </div>
  ),
};

/** Círculos numéricos para contagens (tarefas, alertas, mensagens). */
export const CounterVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Tasks</span>
        <Badge variant="counter">5</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Alerts</span>
        <Badge variant="counter-danger">2</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Achievements</span>
        <Badge variant="counter-success">12</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Messages</span>
        <Badge variant="counter-secondary">3</Badge>
      </div>
    </div>
  ),
};
