import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";

/**
 * `Dialog` é um modal centralizado que interrompe o fluxo para uma decisão
 * ou informação importante (confirmações, formulários curtos). Construído
 * sobre `@radix-ui/dialog`: gerencia foco, `Escape` para fechar, e bloqueia
 * a rolagem do fundo automaticamente.
 *
 * Para conteúdo lateral (não bloqueante/menos crítico), prefira `Sheet`.
 *
 * ## Como usar
 * - Sempre inclua `DialogTitle` — é obrigatório para acessibilidade (leitores
 *   de tela anunciam o modal por ele). Se o título não deve aparecer
 *   visualmente, use um componente `sr-only`, nunca omita.
 * - Use `DialogFooter` para as ações (confirmar/cancelar), com o botão mais
 *   importante à direita em telas largas.
 * - O `X` de fechar no canto superior direito já vem incluso
 *   (`showCloseButton`, default `true`).
 */
const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Confirmação simples com duas ações. */
export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this task?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The task will be permanently removed
            from your list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Dialog sem botão de fechar no canto (fluxo que exige uma escolha explícita). */
export const WithoutCornerClose: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open forced-choice dialog</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Choose an option</DialogTitle>
          <DialogDescription>
            You must pick one of the actions below to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Not now</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
