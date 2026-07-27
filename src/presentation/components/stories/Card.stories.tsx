import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Star, Pill } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";

const meta = {
  title: "Design System/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Superfície visual para agrupar informações relacionadas.

### Composição
Combine \`CardHeader\`, \`CardTitle\`, \`CardDescription\`, \`CardContent\` e \`CardFooter\`. A estrutura é opcional: use somente as regiões necessárias, sem duplicar títulos.

### Quando usar
Para formulários, resumos e blocos de conteúdo que precisam de separação visual. Cards de domínio, como lembretes, devem usar seus componentes próprios.

### Acessibilidade
\`Card\` não adiciona semântica sozinho. Quando o bloco for uma seção, forneça título adequado ao contexto. Evite tornar todo o card clicável quando ele contém outras ações.
        `,
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Card básico com título, descrição e corpo simples. */
export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Informações da tarefa</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Dados relacionados ficam agrupados em uma superfície com borda e
          sombra semânticas.
        </CardDescription>
      </CardContent>
    </Card>
  ),
};

/** Card "featured" com fundo colorido para chamar atenção. */
export const Featured: Story = {
  render: () => (
    <Card className="w-96 border-2 border-primary/30 bg-primary-light">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Star className="size-4" /> Informação importante
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Use destaque semântico para uma informação que exige atenção.
        </CardDescription>
      </CardContent>
    </Card>
  ),
};

/** Card com badge de status, título, descrição e botão de ação. */
export const WithAction: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="flex-row items-center justify-between">
        <Badge variant="destructive">Prioridade alta</Badge>
        <span className="text-sm text-muted-foreground">10:00</span>
      </CardHeader>
      <CardContent className="pt-4">
        <CardTitle className="text-base">Consulta com cardiologista</CardTitle>
        <CardDescription className="pt-1">
          Retorno para acompanhamento dos exames
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Iniciar tarefa</Button>
      </CardFooter>
    </Card>
  ),
};

/** Card com ícone, título e ação de sucesso — fluxo de "concluir tarefa". */
export const WithIconAndCompleteAction: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="flex-row items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive-light">
          <Pill className="size-[18px] text-destructive" />
        </div>
        <div>
          <CardTitle className="text-base">12:00</CardTitle>
          <CardDescription className="text-sm">
            Lembrete de medicação
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <CardTitle className="text-base font-semibold">
          Medicação do almoço
        </CardTitle>
        <CardDescription className="pt-1">
          Metformina 500mg com alimento
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="success" className="w-full">
          Marcar como tomado
        </Button>
      </CardFooter>
    </Card>
  ),
};

/** Card com gradiente para destacar métricas (ex.: resumo semanal). */
export const Summary: Story = {
  render: () => (
    <Card
      className="w-96 border-primary bg-primary p-5 text-primary-foreground"
    >
      <p className="text-sm font-semibold tracking-wide text-primary-foreground/80 uppercase">
        Resumo semanal
      </p>
      <p className="pt-3 text-4xl font-black">18</p>
      <p className="pt-1 text-sm text-primary-foreground/90">Tarefas concluídas</p>
      <p className="flex items-center gap-2 pt-4 text-sm text-primary-foreground/90">
        Sequência de 7 dias ativa!
      </p>
    </Card>
  ),
};
