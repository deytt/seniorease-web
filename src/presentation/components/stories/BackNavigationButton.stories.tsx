import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BackNavigationButton } from "@/presentation/components/ui/backNavigationButton";

const meta = {
  title: "Estrutura/BackNavigationButton",
  component: BackNavigationButton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Botão de retorno usado no topo de páginas internas do SeniorEase.

### Quando usar
- Para voltar do cadastro ou detalhe à listagem correspondente.
- Para retornar de uma área secundária ao Dashboard ou Perfil.

### Quando evitar
- Não representa **cancelamento** de formulário nem **saída** do Modo Guiado.
- Não use uma seta isolada quando houver espaço para um rótulo contextual.

### Acessibilidade
Usa o tamanho compacto de 44px, mantém texto visível e aplica o rótulo ao link. O destino deve ser previsível e o texto deve indicar o contexto de retorno.
        `,
      },
    },
  },
  args: {
    href: "#conteudo",
    label: "Voltar ao Dashboard",
  },
} satisfies Meta<typeof BackNavigationButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {};

export const ListaDeTarefas: Story = {
  args: { label: "Voltar para Tarefas" },
};

export const Perfil: Story = {
  args: { label: "Voltar para o Perfil" },
};
