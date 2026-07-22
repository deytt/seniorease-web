import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mail, Plus, Trash2, Bell } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

/**
 * `Button` é o componente de ação primária do SeniorEase. Todos os tamanhos
 * respeitam o requisito de acessibilidade do design system: altura mínima de
 * 44px (`sm`), sendo `default` (56px) e `lg` (64px) recomendados para ações
 * de destaque, já que o público-alvo (idosos) precisa de alvos de toque
 * grandes e alto contraste.
 *
 * ## Quando usar
 * - `default` (primary): ação principal de uma tela ou card.
 * - `secondary` / `success` / `destructive`: ações com significado semântico
 *   (ex.: concluir, excluir).
 * - `outline`: ação secundária que precisa de menos peso visual que o primary.
 * - `ghost`: ação terciária "leve", mas ainda visível em repouso (fundo azul
 *   claro permanente — não depende do hover para ser percebida).
 * - `link`: ação em formato de texto, dentro de parágrafos ou rodapés de card.
 *
 * ## Acessibilidade
 * - Nunca usar `size="icon"`/`"icon-sm"` sem um `<span className="sr-only">`
 *   descrevendo a ação para leitores de tela.
 * - Evitar depender só de cor para indicar estado: o texto do botão deve
 *   deixar a ação clara (ex.: "Excluir", não apenas um ícone de lixeira).
 */
const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "success",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
      description: "Estilo visual e peso semântico da ação.",
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "icon", "icon-sm"],
      description:
        "Altura do botão. `sm` = 44px (mínimo aceitável), `default` = 56px (recomendado), `lg` = 64px (CTAs principais).",
      table: { defaultValue: { summary: "default" } },
    },
    asChild: {
      control: "boolean",
      description:
        "Quando true, repassa as props e estilos para o elemento filho (via Radix Slot) em vez de renderizar um <button>. Útil para usar Button como um <a>/<Link>.",
    },
    disabled: {
      control: "boolean",
      description: "Desabilita interação e aplica opacidade reduzida.",
    },
    loading: {
      control: "boolean",
      description:
        "Exibe spinner e texto de espera, desabilita novos cliques e informa o estado a leitores de tela.",
    },
    loadingText: {
      control: "text",
      description: "Texto apresentado enquanto a ação está em andamento.",
    },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uso padrão: ação primária. */
export const Default: Story = {};

/** Todas as variantes semânticas lado a lado, no tamanho recomendado. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="destructive">Danger</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`ghost` deve permanecer visivelmente um botão em repouso (fundo azul claro), não apenas ao passar o mouse — essencial para usuários que não percebem facilmente affordances sutis.",
      },
    },
  },
};

/** Escala de tamanhos, todos acima do mínimo de 44px de toque. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small (44px)</Button>
      <Button size="default">Medium (56px)</Button>
      <Button size="lg">Large (64px)</Button>
    </div>
  ),
};

/** Botões com ícone à esquerda do texto. */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <Plus /> Add Task
      </Button>
      <Button variant="success">
        <Bell /> Notify
      </Button>
      <Button variant="destructive">
        <Trash2 /> Delete
      </Button>
    </div>
  ),
};

/** Apenas ícone — sempre inclua um rótulo acessível via `sr-only`. */
export const IconOnly: Story = {
  render: () => (
    <Button size="icon" aria-label="Enviar e-mail">
      <Mail />
    </Button>
  ),
};

/** Ocupa 100% da largura do container — comum em formulários mobile. */
export const FullWidth: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-2">
      <Button className="w-full">Primary Full Width</Button>
      <Button variant="outline" className="w-full">
        Secondary Full Width
      </Button>
    </div>
  ),
};

/** Estado desabilitado. */
export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};

/** Estado de uma ação assíncrona, sem alterar o tamanho do alvo de toque. */
export const Loading: Story = {
  args: {
    loading: true,
    loadingText: "Salvando...",
    children: "Salvar alterações",
  },
};
