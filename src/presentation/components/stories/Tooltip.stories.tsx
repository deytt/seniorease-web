import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Info } from "lucide-react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/presentation/components/ui/tooltip";
import { Button } from "@/presentation/components/ui/button";

/**
 * `Tooltip` mostra uma dica curta ao passar o mouse ou focar um elemento
 * (não deve conter a única fonte de uma informação essencial — em telas de
 * toque o hover não existe, então o conteúdo crítico precisa estar visível
 * por outro meio também).
 *
 * ## Como usar
 * - Envolva a árvore (ou o app inteiro) em um único `TooltipProvider`,
 *   próximo à raiz — não é necessário repetir por tooltip.
 * - `TooltipTrigger` deve ser um elemento focável (botão, link, ícone com
 *   `tabIndex`), nunca um `<div>` sem foco.
 * - Prefira frases curtas (poucas palavras); para explicações longas, use
 *   um `Dialog` ou texto visível na tela.
 */
const meta = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: `
Explicação curta exibida por foco ou ponteiro para complementar um controle.

### Quando usar
Para esclarecer ícones ou termos breves. Informações necessárias para concluir uma tarefa devem permanecer visíveis.

### Acessibilidade
Use uma frase curta, sem ações internas. O disparador precisa funcionar por teclado e possuir nome acessível mesmo sem a tooltip.
    ` } },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tooltip em um botão de ícone. */
export const OnIconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Mais informações">
          <Info />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Esta ação não pode ser desfeita</TooltipContent>
    </Tooltip>
  ),
};

/** Tooltip em texto/rótulo comum. */
export const OnText: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4">
        Metformina
      </TooltipTrigger>
      <TooltipContent>Medicamento para controle de glicose</TooltipContent>
    </Tooltip>
  ),
};
