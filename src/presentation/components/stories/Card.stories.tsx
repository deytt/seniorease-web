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

/**
 * `Card` é o container padrão para agrupar conteúdo relacionado (tarefas,
 * resumos, itens de lista). Usa `rounded-2xl` (16px), borda sutil e sombra
 * leve (`shadow-card`) para criar separação visual sem parecer pesado.
 *
 * Composição: `Card` > `CardHeader` (título + descrição) > `CardContent`
 * (corpo) > `CardFooter` (ações). Todos os subcomponentes aceitam
 * `className` para composição livre.
 *
 * > **Nota de auditoria:** o Figma (node 2:7128 — "Cards") especifica
 * > padding interno de ~21px; esta implementação usa `p-8` (32px). Se o
 * > padding maior não for intencional, ajuste `CardHeader`/`CardContent`.
 *
 * ## Quando usar
 * - Agrupar informações que fazem sentido como uma unidade (ex.: uma tarefa
 *   com prazo, prioridade e botão de ação).
 * - Para variações de cor (destaque, sucesso, alerta), aplique `className`
 *   com o fundo e borda semânticos — não crie uma prop `variant` nova sem
 *   necessidade; a maioria dos casos é resolvida compondo classes.
 */
const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Card básico com título, descrição e corpo simples. */
export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Basic Card</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Standard white card with subtle border and shadow. Used for content
          grouping throughout the app.
        </CardDescription>
      </CardContent>
    </Card>
  ),
};

/** Card "featured" com fundo colorido para chamar atenção. */
export const Featured: Story = {
  render: () => (
    <Card className="w-96 border-2 border-[#bfdbfe] bg-[#eff6ff]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#2563eb]">
          <Star className="size-4" /> Featured Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Highlighted version with colored background. Used for important
          information or calls to action.
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
        <Badge variant="destructive">High Priority</Badge>
        <span className="text-xs text-muted-foreground">10:00 AM</span>
      </CardHeader>
      <CardContent className="pt-4">
        <CardTitle className="text-base">Call Dr. Rivera</CardTitle>
        <CardDescription className="pt-1">
          Schedule follow-up appointment
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Start Task</Button>
      </CardFooter>
    </Card>
  ),
};

/** Card com ícone, título e ação de sucesso — fluxo de "concluir tarefa". */
export const WithIconAndCompleteAction: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="flex-row items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[#fef2f2]">
          <Pill className="size-[18px] text-[#ef4444]" />
        </div>
        <div>
          <CardTitle className="text-base">12:00 PM</CardTitle>
          <CardDescription className="text-xs">
            Medication Reminder
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <CardTitle className="text-base font-semibold">
          Lunch Medication
        </CardTitle>
        <CardDescription className="pt-1">
          Metformin 500mg with food
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="success" className="w-full">
          Mark as Taken ✓
        </Button>
      </CardFooter>
    </Card>
  ),
};

/** Card com gradiente para destacar métricas (ex.: resumo semanal). */
export const Summary: Story = {
  render: () => (
    <Card
      className="w-96 border-0 p-5 text-white"
      style={{
        backgroundImage:
          "linear-gradient(150deg, rgb(37, 99, 235) 0%, rgb(29, 78, 216) 100%)",
      }}
    >
      <p className="text-xs font-semibold tracking-wide text-[#bedbff] uppercase">
        Weekly Summary
      </p>
      <p className="pt-3 text-4xl font-black">18</p>
      <p className="pt-1 text-sm text-[#dbeafe]">Tasks completed</p>
      <p className="flex items-center gap-2 pt-4 text-xs text-[#dbeafe]">
        7-day streak active!
      </p>
    </Card>
  ),
};
