import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { User, Settings, LogOut, Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from "@/presentation/components/ui/dropdown-menu";
import { Button } from "@/presentation/components/ui/button";

/**
 * `DropdownMenu` exibe uma lista de ações ou opções acionada por um botão
 * (ex.: menu de usuário, menu de "mais opções" de um item de lista).
 *
 * ## Como usar
 * - Use `DropdownMenuItem` para ações simples; `variant="destructive"` para
 *   ações irreversíveis (ex.: "Excluir conta"), que ganham cor de destaque.
 * - Use `DropdownMenuCheckboxItem` para opções que podem ser
 *   ligadas/desligadas sem fechar o menu.
 * - Agrupe itens relacionados com `DropdownMenuSeparator` e rotule grupos
 *   com `DropdownMenuLabel`.
 *
 * ⚠️ Considerando o público-alvo do SeniorEase (idosos), prefira ações
 * simples e uma única camada de menu — evite submenus aninhados sempre que
 * possível, pois exigem maior precisão motora para navegar.
 */
const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Menu de conta de usuário — o caso de uso mais comum. */
export const UserMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">My account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Jane Doe</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Menu com opções marcáveis (checkbox) que não fecham o menu ao clicar. */
export const WithCheckboxItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Bell /> Notifications
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Notify me about</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>
          Medication reminders
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>
          Appointment alerts
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Marketing emails</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
