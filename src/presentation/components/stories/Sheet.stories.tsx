import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/presentation/components/ui/sheet";
import { Button } from "@/presentation/components/ui/button";

/**
 * `Sheet` é um painel deslizante (drawer) que entra a partir de uma borda da
 * tela (`top`, `right`, `bottom` ou `left`). Use para navegação secundária,
 * filtros ou formulários que não precisam interromper o fluxo tanto quanto
 * um `Dialog` central.
 *
 * ## Como usar
 * - `side="right"` (padrão) é o mais comum para menus e detalhes.
 * - `side="bottom"` funciona bem em mobile para ações rápidas (ex.: menu de
 *   opções de um item).
 * - Assim como o `Dialog`, `SheetTitle` é obrigatório para acessibilidade.
 */
const meta = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Painel padrão entrando pela direita. */
export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust your notification and accessibility preferences.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/** Painel entrando de baixo — comum em mobile para menus de ação rápida. */
export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open quick actions</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick actions</SheetTitle>
          <SheetDescription>Choose what to do with this task.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button variant="destructive">Delete task</Button>
          <Button variant="outline">Reschedule</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
