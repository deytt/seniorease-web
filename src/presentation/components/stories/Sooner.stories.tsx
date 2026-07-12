import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
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
  title: "Components/Sooner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Variantes de notificações de sucesso, erro, informação, aviso e carregamento. */
export const Variants: Story = {
  render: () => {
    useEffect(() => {
      // Dispara automaticamente os toasts quando a story monta
      const timers = [
        setTimeout(
          () => toast.success("Morning medication has been marked as done."),
          300,
        ),
        setTimeout(() => toast.info("You'll be reminded at 10:00 AM."), 600),
        setTimeout(
          () => toast.warning("It's time to take your lunch medication."),
          900,
        ),
        setTimeout(() => toast.error("You missed your 8 AM medication."), 1200),
      ];

      return () => timers.forEach((timer) => clearTimeout(timer));
    }, []);

    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Toaster />
        <div className="text-center text-sm text-muted-foreground">
          As notificações aparecem no canto superior direito...
        </div>
      </div>
    );
  },
};

/** Botões interativos para disparar cada variante de notificação. */
export const Interactive: Story = {
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

/** Notificações com descrição/subtítulo abaixo do título. */
export const WithDescription: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Toaster />
      <Button
        onClick={() =>
          toast.success("Medicação tomada", {
            description: "Seu medicamento da manhã foi registrado com sucesso.",
          })
        }
      >
        Success + Description
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast.error("Erro ao salvar", {
            description:
              "Verifique sua conexão com a internet e tente novamente.",
          })
        }
      >
        Error + Description
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info("Novo lembrete", {
            description:
              "Você será notificado em 1 hora para tomar o próximo remédio.",
          })
        }
      >
        Info + Description
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning("Aviso importante", {
            description:
              "Este medicamento não deve ser tomado com comida. Procure um médico se tiver dúvidas.",
          })
        }
      >
        Warning + Description
      </Button>
    </div>
  ),
};
