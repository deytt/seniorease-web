import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "@/presentation/components/ui/separator";

/**
 * `Separator` desenha uma linha divisória fina (1px) para separar seções de
 * conteúdo, horizontal ou verticalmente. É `decorative` por padrão (não é
 * anunciado por leitores de tela) — mude `decorative={false}` apenas se a
 * linha representa uma separação semântica real (ex.: fim de uma lista).
 *
 * ## Como usar
 * - Horizontal: dentro de um container de largura definida, sem precisar de
 *   props extras.
 * - Vertical: defina `orientation="vertical"` e garanta que o pai tenha uma
 *   altura definida (`self-stretch` ou altura fixa), já que a linha vertical
 *   ocupa 100% da altura do container.
 */
const meta = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Direção da linha divisória.",
      table: { defaultValue: { summary: "horizontal" } },
    },
    decorative: {
      control: "boolean",
      description:
        "Quando true (padrão), a linha é puramente visual e ignorada por leitores de tela.",
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Divisor horizontal entre dois blocos de texto. */
export const Horizontal: Story = {
  render: () => (
    <div className="w-80">
      <p className="text-sm text-foreground">Seção 1</p>
      <Separator className="my-3" />
      <p className="text-sm text-foreground">Seção 2</p>
    </div>
  ),
};

/** Divisor vertical entre itens em linha (ex.: navegação do header). */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3">
      <span className="text-sm text-foreground">Item 1</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-foreground">Item 2</span>
    </div>
  ),
};
