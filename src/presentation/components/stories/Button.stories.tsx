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
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Componente único para ações interativas do SeniorEase.

### Uso
Use **default** para a ação principal, **outline/ghost** para ações secundárias, **success** para conclusão e **destructive** para operações irreversíveis. Links com aparência de botão devem usar \`asChild\`.

### Tamanhos
\`sm\` tem 44px, \`default\` 56px e \`lg\` 64px. Ações somente com ícone usam \`icon-sm\` ou \`icon\` e exigem nome acessível.

### Estados e acessibilidade
\`loading\` impede cliques repetidos e expõe \`aria-busy\`. O texto deve descrever a ação; não dependa apenas de cor ou ícone. Preserve foco visível e não reduza manualmente a altura abaixo de 44px.
        `,
      },
    },
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
      <Button variant="default">Salvar</Button>
      <Button variant="secondary">Continuar</Button>
      <Button variant="success">Concluir</Button>
      <Button variant="destructive">Excluir</Button>
      <Button variant="outline">Cancelar</Button>
      <Button variant="ghost">Voltar</Button>
      <Button variant="link">Saiba mais</Button>
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
      <Button size="sm">Compacto (44px)</Button>
      <Button size="default">Padrão (56px)</Button>
      <Button size="lg">Destaque (64px)</Button>
    </div>
  ),
};

/** Botões com ícone à esquerda do texto. */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <Plus /> Nova tarefa
      </Button>
      <Button variant="success">
        <Bell /> Ativar aviso
      </Button>
      <Button variant="destructive">
        <Trash2 /> Excluir
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
      <Button className="w-full">Salvar alterações</Button>
      <Button variant="outline" className="w-full">
        Cancelar
      </Button>
    </div>
  ),
};

/** Estado desabilitado. */
export const Disabled: Story = {
  args: { disabled: true, children: "Indisponível" },
};

/** Estado de uma ação assíncrona, sem alterar o tamanho do alvo de toque. */
export const Loading: Story = {
  args: {
    loading: true,
    loadingText: "Salvando...",
    children: "Salvar alterações",
  },
};
