import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "@/presentation/components/ui/label";
import { Input } from "@/presentation/components/ui/input";
import { Checkbox } from "@/presentation/components/ui/checkbox";

/**
 * `Label` é o rótulo de texto para campos de formulário (Input, Checkbox,
 * Switch, etc.), construído sobre `@radix-ui/label` para garantir que um
 * clique/toque no texto foque ou acione o controle associado.
 *
 * ## Como usar
 * - Com um `<Input>`: use `htmlFor` apontando para o `id` do input.
 * - Com `Checkbox`/`Switch`: envolva o controle e o texto dentro do próprio
 *   `<Label>` para expandir a área clicável (importante para toque grande).
 *
 * Herda `peer-disabled:opacity-70` — quando o controle irmão (`peer`) está
 * desabilitado, o rótulo também fica visualmente esmaecido automaticamente.
 */
const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uso padrão, associado via htmlFor. */
export const WithInput: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="story-name">Nome completo</Label>
      <Input id="story-name" placeholder="Jane Doe" />
    </div>
  ),
};

/** Envolvendo um Checkbox — clicar no texto também marca o checkbox. */
export const WrappingCheckbox: Story = {
  render: () => (
    <Label className="flex items-center gap-3 font-normal">
      <Checkbox /> Aceito os termos de uso
    </Label>
  ),
};
