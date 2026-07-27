import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TourHelpButton } from "@/presentation/tour/TourChrome";

const meta = {
  title: "Estrutura/TourHelpButton",
  component: TourHelpButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Botão de ajuda contextual usado nos cabeçalhos para iniciar o tour guiado da tela.

### Uso
- Deve ser passado à propriedade \`tourAction\` do \`PageHeader\`.
- O rótulo acessível precisa identificar o tour correspondente.
- Mantém alvo mínimo de 44px e responde à preferência global de alvos maiores.
        `,
      },
    },
  },
  args: {
    onClick: () => undefined,
    label: "Abrir tour guiado das tarefas",
  },
} satisfies Meta<typeof TourHelpButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const FocoPorTeclado: Story = {
  play: async ({ canvasElement }) => {
    canvasElement.querySelector("button")?.focus();
  },
};

export const AltoContraste: Story = {
  globals: { appearance: "high" },
};

export const AlvoDeToqueMaior: Story = {
  globals: { largeTouchTargets: true },
};
