import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { ReminderFilterPills } from "@/presentation/components/reminders/reminderFilterPills";
import type { ReminderFilterSelection } from "@/presentation/components/reminders/reminderFilterPills";

/**
 * `ReminderFilterPills` oferece filtros exclusivos para a lista de lembretes.
 * Permite usuários filtrar por: Todos → Hoje → Categoria específica.
 *
 * ## Filtros Disponíveis
 * - **Todos** (padrão): mostra todos os lembretes sem filtro
 * - **Hoje**: mostra apenas lembretes agendados para hoje
 * - **Categorias**: medication, appointment, hydration, meal, bills
 *   - Em modo básico: apenas medication, appointment
 *
 * ## Comportamento
 * - Seleção exclusiva: apenas um filtro ativo por vez
 * - Clique em filtro ativo desativa-o e volta para "Todos"
 * - Ordem fixa: Todos → Hoje → categorias alfabéticas
 *
 * ## Acessibilidade
 * - role="radiogroup" + role="radio" para seleção
 * - aria-checked para indicar estado
 * - Keyboard navigable (Tab, Space, Arrow keys)
 *
 * ## Caso de Uso
 * Usado em `/reminders` acima da lista de cards para permitir
 * filtros rápidos com wrap automático em mobile.
 */
const meta = {
  title: "Features/ReminderFilterPills",
  component: ReminderFilterPills,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Filtros exclusivos para lista de lembretes: Todos, Hoje, e categorias. Suporta modo básico.",
      },
    },
  },
} satisfies Meta<typeof ReminderFilterPills>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Modo interativo com controle de estado.
 * Demonstra todos os filtros disponíveis em modo completo.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<ReminderFilterSelection>({
      kind: "all",
    });

    return (
      <div className="space-y-4 w-full max-w-md">
        <p className="text-sm text-muted-foreground">
          Filtro selecionado:{" "}
          <span className="font-bold">
            {value.kind === "all"
              ? "Todos"
              : value.kind === "today"
                ? "Hoje"
                : `Categoria: ${value.category}`}
          </span>
        </p>
        <ReminderFilterPills value={value} onChange={setValue} />
      </div>
    );
  },
};

/**
 * Modo básico: apenas medication e appointment como opções de categoria.
 * Útil para interfaces simplificadas para usuários com menos experiência.
 */
export const BasicMode: Story = {
  render: () => {
    const [value, setValue] = useState<ReminderFilterSelection>({
      kind: "all",
    });

    return (
      <div className="space-y-4 w-full max-w-md">
        <p className="text-sm text-muted-foreground">
          <strong>Modo Básico:</strong> Apenas medication + appointment
        </p>
        <p className="text-sm text-muted-foreground">
          Filtro selecionado:{" "}
          <span className="font-bold">
            {value.kind === "all"
              ? "Todos"
              : value.kind === "today"
                ? "Hoje"
                : `Categoria: ${value.category}`}
          </span>
        </p>
        <ReminderFilterPills value={value} onChange={setValue} isBasicMode />
      </div>
    );
  },
};

/**
 * Filtro "Hoje" ativo: demonstra como se vê quando esse filtro está selecionado.
 */
export const TodayActive: Story = {
  render: () => {
    const [value, setValue] = useState<ReminderFilterSelection>({
      kind: "today",
    });

    return (
      <div className="space-y-4 w-full max-w-md">
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded">
          ℹ️ Filtro "Hoje" está ativo
        </p>
        <ReminderFilterPills value={value} onChange={setValue} />
      </div>
    );
  },
};

/**
 * Filtro por categoria ativo: exemplo com categoria "medication".
 */
export const CategoryActive: Story = {
  render: () => {
    const [value, setValue] = useState<ReminderFilterSelection>({
      kind: "category",
      category: "medication",
    });

    return (
      <div className="space-y-4 w-full max-w-md">
        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 p-2 rounded">
          ✅ Filtro por categoria "Medicação" está ativo
        </p>
        <ReminderFilterPills value={value} onChange={setValue} />
      </div>
    );
  },
};

/**
 * Demonstração responsiva: pills com wrap automático em tamanhos menores.
 * Redimensione a janela para ver o comportamento.
 */
export const Responsive: Story = {
  render: () => {
    const [value, setValue] = useState<ReminderFilterSelection>({
      kind: "all",
    });

    return (
      <div className="space-y-4 w-full">
        <p className="text-xs text-muted-foreground">
          👉 Redimensione a tela para ver wrap automático em mobile
        </p>
        <div className="border-2 border-dashed border-muted p-4 rounded-lg">
          <ReminderFilterPills value={value} onChange={setValue} />
        </div>
        <p className="text-sm text-muted-foreground">
          Selecionado:{" "}
          <span className="font-bold">{JSON.stringify(value)}</span>
        </p>
      </div>
    );
  },
};
