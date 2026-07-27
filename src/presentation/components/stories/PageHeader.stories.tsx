import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CircleHelp, Plus } from "lucide-react";

import { AppContentDecorator } from "../../../../.storybook/decorators/AppContentDecorator";
import { Button } from "@/presentation/components/ui/button";
import { PageHeader } from "@/presentation/components/ui/pageHeader";
import { TourHelpButton } from "@/presentation/tour/TourChrome";

const meta = {
  title: "Estrutura/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Cabeçalho estrutural compartilhado pelas páginas do SeniorEase. Centraliza hierarquia de título, descrição, retorno contextual e ações laterais.

### Composição
- **Título:** sempre usa a classe estrutural \`page-title\`.
- **Descrição:** texto de apoio opcional em tamanho de corpo.
- **Retorno:** usa internamente \`BackNavigationButton\`.
- **Ações:** área opcional para ajuda, filtros ou criação.

### Responsividade
Em telas estreitas, conteúdo e ações ficam empilhados; a partir de \`sm\`, passam para a mesma linha. As ações devem continuar utilizáveis com zoom e textos ampliados.

### Acessibilidade
Renderiza um \`header\` e um único \`h1\`. Não inclua outro título de nível 1 dentro das ações.
        `,
      },
    },
  },
  decorators: [AppContentDecorator],
  args: {
    title: "Minhas Tarefas",
    description: "2 de 4 tarefas concluídas hoje",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

export const ComRetorno: Story = {
  args: {
    title: "Nova Tarefa",
    description: "Preencha os detalhes da atividade.",
    backHref: "#conteudo",
    backLabel: "Voltar para Tarefas",
  },
};

export const ComAcoes: Story = {
  args: {
    actions: (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" aria-label="Abrir ajuda">
          <CircleHelp aria-hidden="true" />
          Ajuda
        </Button>
        <Button size="sm">
          <Plus aria-hidden="true" />
          Nova Tarefa
        </Button>
      </div>
    ),
  },
};

export const ComTour: Story = {
  args: {
    tourAction: (
      <TourHelpButton
        onClick={() => undefined}
        label="Abrir tour guiado das tarefas"
      />
    ),
  },
};

export const ComAcoesETour: Story = {
  args: {
    actions: (
      <div className="flex w-full gap-2 sm:w-auto">
        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
          Filtrar
        </Button>
        <Button size="sm" className="flex-1 sm:flex-none">
          <Plus aria-hidden="true" />
          Nova Tarefa
        </Button>
      </div>
    ),
    tourAction: (
      <TourHelpButton
        onClick={() => undefined}
        label="Abrir tour guiado das tarefas"
      />
    ),
  },
};

export const MobileComAcoesETour: Story = {
  ...ComAcoesETour,
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};
