import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "@/presentation/lib/feedbackToast";

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
 * - Importe `toast` de `@/presentation/lib/feedbackToast` e use
 *   `toast.success(...)`, `toast.error(...)`,
 *   `toast.info(...)`, `toast.warning(...)` ou `toast.loading(...)` de
 *   qualquer lugar do código, sem precisar de contexto/hooks adicionais.
 * - Use mensagens curtas e específicas ("Task marked as done", não apenas
 *   "Success") para que quem usa leitor de tela entenda o que aconteceu
 *   mesmo sem ver a tela.
 */
const meta = {
  title: "Feedback/Toast",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: `
Mensagem temporária para confirmar resultados sem interromper o fluxo.

### Quando usar
Sucesso, informação, aviso ou erro após uma ação. Não use para decisões, conteúdo extenso ou erros que precisam permanecer junto ao campo.

### Implementação e acessibilidade
Renderize \`Toaster\` uma vez e use a fachada \`feedbackToast\`. Escreva mensagens específicas e compreensíveis fora do contexto visual; não dependa apenas de ícone ou cor.
    ` } },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Disparo de cada variante de toast disponível. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Toaster />
      <Button onClick={() => toast.success("Tarefa marcada como concluída") }>
        Sucesso
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error("Não foi possível salvar as alterações")}
      >
        Erro
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info("Sua consulta é amanhã às 10:00")}
      >
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.warning("Verifique a bateria do dispositivo")}
      >
        Aviso
      </Button>
      <Button
        variant="ghost"
        onClick={() => toast.loading("Salvando sua tarefa...")}
      >
        Carregando
      </Button>
    </div>
  ),
};
