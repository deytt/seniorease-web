import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";

import { Toaster } from "@/presentation/components/ui/sonner";
import { Button } from "@/presentation/components/ui/button";

/**
 * `Toaster` renderiza notificações temporárias ("toasts") no canto da tela,
 * usadas para confirmar uma ação sem interromper o fluxo (ex.: "Tarefa
 * salva com sucesso"). Baseado em `sonner`, com ícones e cores já mapeados
 * para os tokens do tema (`--normal-bg`, `--normal-text`, `--normal-border`).
 *
 * ## Como usar
 * - Renderize `<Toaster />` **uma única vez**, próximo à raiz do app
 *   (ex.: no layout principal) — não a cada tela.
 * - Dispare toasts chamando `toast.success(...)`, `toast.error(...)`,
 *   `toast.info(...)`, `toast.warning(...)` ou `toast.loading(...)` de
 *   qualquer lugar do código, sem precisar de contexto/hooks adicionais.
 * - Use mensagens curtas e específicas ("Task marked as done", não apenas
 *   "Success") para que quem usa leitor de tela entenda o que aconteceu
 *   mesmo sem ver a tela.
 */
const meta = {
  title: "Components/Toast",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Disparo de cada variante de toast disponível. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Toaster />
      <Button onClick={() => toast.success("Task marked as done")}>
        Success
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error("Could not save changes")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info("Your appointment is tomorrow at 10 AM")}
      >
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.warning("Low battery on your device")}
      >
        Warning
      </Button>
      <Button
        variant="ghost"
        onClick={() => toast.loading("Saving your task...")}
      >
        Loading
      </Button>
    </div>
  ),
};
