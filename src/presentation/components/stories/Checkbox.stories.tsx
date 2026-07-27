import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Label } from "@/presentation/components/ui/label";

/**
 * `Checkbox` marca itens booleanos (tarefas concluídas, opções selecionadas).
 * Visualmente é 24x24px com borda de 2px e cantos de 10px — mas a área
 * clicável real deve vir do `<label>` que envolve o componente, garantindo
 * ao menos 44px de alvo de toque, conforme o padrão de acessibilidade do
 * SeniorEase.
 *
 * ## Como usar
 * Sempre envolva o Checkbox e seu texto em um `<label>` (ou use o
 * componente `Label` com `htmlFor`), nunca deixe o checkbox sozinho sem
 * rótulo clicável.
 *
 * ```tsx
 * <Label className="flex items-center gap-3">
 *   <Checkbox checked={done} onCheckedChange={setDone} />
 *   Take morning medication
 * </Label>
 * ```
 */
const meta = {
  title: "Formulários/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Controle para uma escolha independente de sim/não, como aceitar termos ou ativar uma opção complementar.

### Quando usar
Use checkbox quando várias opções puderem ser selecionadas ao mesmo tempo. Para uma configuração com efeito imediato, prefira \`Switch\`; para escolha exclusiva, use radio/segmentado.

### Acessibilidade
Associe sempre um \`Label\`. O indicador visual tem 24px, mas o rótulo deve ampliar a área clicável para no mínimo 44px. Estados \`checked\`, \`disabled\` e foco precisam ser perceptíveis sem depender apenas da cor.
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Estado controlado de marcação.",
    },
    disabled: {
      control: "boolean",
      description: "Desabilita interação e reduz a opacidade.",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uso isolado, sem rótulo — evite em produção, use apenas para inspeção visual. */
export const Default: Story = {
  args: { checked: true },
};

/** Padrão de uso recomendado: dentro de um label clicável, com texto real de tarefa. */
export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Label className="flex items-center gap-3 font-normal">
        <Checkbox checked /> Take morning medication
      </Label>
      <Label className="flex items-center gap-3 font-normal">
        <Checkbox /> Morning walk (unchecked)
      </Label>
      <Label className="flex items-center gap-3 font-normal">
        <Checkbox checked /> Family call scheduled
      </Label>
    </div>
  ),
};

/** Estado desabilitado, marcado e desmarcado. */
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Label className="flex items-center gap-3 font-normal opacity-70">
        <Checkbox disabled /> Disabled unchecked
      </Label>
      <Label className="flex items-center gap-3 font-normal opacity-70">
        <Checkbox disabled checked /> Disabled checked
      </Label>
    </div>
  ),
};
