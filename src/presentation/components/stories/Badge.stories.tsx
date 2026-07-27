import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@/presentation/components/ui/badge";

/**
 * `Badge` identifica status, prioridade e categoria em toda a aplicação.
 * Existem dois grupos de variantes:
 *
 * - **Status** (`default`, `success`, `warning`, `destructive`, `secondary`,
 *   `purple`, `outline`): pill com fundo colorido claro e texto na cor
 *   correspondente mais saturada, sempre por tokens semânticos do tema.
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
  title: "Design System/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Rótulo compacto para status, prioridade, categoria ou contagem.

### Escolha da variante
Use variantes semânticas para estados e \`counter-*\` apenas para contagens curtas. O texto deve permanecer compreensível sem depender da cor.

### Quando evitar
Badge não é botão, filtro ou campo. Para seleção interativa, use o controle específico do fluxo.

### Acessibilidade
Mantenha textos com pelo menos 14px, contraste compatível com todos os temas e um rótulo explícito para contadores quando o contexto não for evidente.
        `,
      },
    },
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
      <Badge variant="success">Concluída</Badge>
      <Badge variant="warning">Em andamento</Badge>
      <Badge variant="destructive">Prioridade alta</Badge>
      <Badge variant="secondary">Saúde</Badge>
      <Badge variant="default">Social</Badge>
      <Badge variant="purple">Agendada</Badge>
      <Badge variant="outline">Categoria</Badge>
    </div>
  ),
};

/** Círculos numéricos para contagens (tarefas, alertas, mensagens). */
export const CounterVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Tarefas</span>
        <Badge variant="counter">5</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Alertas</span>
        <Badge variant="counter-danger">2</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Conquistas</span>
        <Badge variant="counter-success">12</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Mensagens</span>
        <Badge variant="counter-secondary">3</Badge>
      </div>
    </div>
  ),
};
