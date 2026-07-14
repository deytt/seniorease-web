import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";

/**
 * `Input` é o campo de texto padrão do SeniorEase: 56px de altura, texto em
 * 16px (evita zoom automático em iOS) e foco com anel de 3px de alto
 * contraste, pensado para quem tem dificuldade de perceber estados sutis.
 *
 * ## Como usar
 * Sempre associe a um `<Label htmlFor>` — nunca use apenas `placeholder`
 * como rótulo, pois ele desaparece ao digitar e não é lido de forma
 * confiável por todos os leitores de tela.
 *
 * Para estado de erro, use `aria-invalid="true"`: a borda e o anel de foco
 * mudam automaticamente para a cor de destructive.
 */
const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "search"],
      description: "Tipo nativo do input HTML.",
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    "aria-invalid": {
      control: "boolean",
      description:
        "Marca o campo como inválido — aplica automaticamente estilo de erro (borda/anel destructive).",
    },
  },
  args: {
    placeholder: "Digite aqui...",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uso padrão. */
export const Default: Story = {
  render: (args) => <Input {...args} className="w-80" />,
};

/** Padrão recomendado: sempre com Label associado. */
export const WithLabel: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="name">Full name</Label>
      <Input id="name" placeholder="Jane Doe" />
    </div>
  ),
};

/** Estado de erro de validação. */
export const Invalid: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="email-error">Email</Label>
      <Input id="email-error" defaultValue="not-an-email" aria-invalid="true" />
      <p className="text-sm text-destructive">Please enter a valid email.</p>
    </div>
  ),
};

/** Estado desabilitado. */
export const Disabled: Story = {
  render: () => <Input className="w-80" placeholder="Disabled" disabled />,
};
