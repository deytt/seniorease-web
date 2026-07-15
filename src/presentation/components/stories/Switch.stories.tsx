"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Switch } from "@/presentation/components/ui/switch";
import { Label } from "@/presentation/components/ui/label";

/**
 * `Switch` alterna uma configuração booleana instantaneamente (sem precisar
 * de um botão "Salvar"). Diferente do `Checkbox`, o efeito é imediato.
 *
 * Tamanhos: `default` (trilho 48x24px, thumb 20px) é o recomendado para
 * qualquer tela do SeniorEase — segue o padrão de toque grande do design
 * system. `sm` (trilho 36x20px) deve ser reservado para contextos muito
 * densos (ex.: tabelas de configurações avançadas), nunca para preferências
 * do usuário final.
 *
 * ## Como usar
 * Sempre acompanhe de um rótulo textual explicando o que a chave liga/desliga,
 * e idealmente do estado atual por extenso (ex.: "Reminders (on)"), já que
 * cor sozinha (azul vs. cinza) pode não ser suficiente para todo mundo.
 */
const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
      description:
        "Tamanho do trilho. `default` = 48x24px (recomendado). `sm` = 36x20px (uso restrito a contextos densos).",
      table: { defaultValue: { summary: "default" } },
    },
    checked: {
      control: "boolean",
      description: "Estado controlado (ligado/desligado).",
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    size: "default",
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uso padrão. */
export const Default: Story = {
  args: { checked: true },
};

/** Interativo: clique para alternar. */
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <span className="text-sm text-muted-foreground">
          {checked ? "Ligado" : "Desligado"}
        </span>
      </div>
    );
  },
};

/** Comparação de tamanhos. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <Switch size="default" checked />
        <span className="text-sm text-muted-foreground">default (48x24)</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch size="sm" checked />
        <span className="text-sm text-muted-foreground">sm (36x20)</span>
      </div>
    </div>
  ),
};

/** Padrão de uso: rótulo + estado por extenso, alinhados às pontas. */
export const WithLabel: Story = {
  render: () => {
    const [reminders, setReminders] = useState(true);
    const [animations, setAnimations] = useState(false);
    const [audio, setAudio] = useState(true);

    return (
      <div className="flex w-80 flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label className="font-normal">
            Reminders ({reminders ? "on" : "off"})
          </Label>
          <Switch checked={reminders} onCheckedChange={setReminders} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="font-normal">
            Animations ({animations ? "on" : "off"})
          </Label>
          <Switch checked={animations} onCheckedChange={setAnimations} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="font-normal">
            Audio feedback ({audio ? "on" : "off"})
          </Label>
          <Switch checked={audio} onCheckedChange={setAudio} />
        </div>
      </div>
    );
  },
};

/** Estado desabilitado. */
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch disabled />
      <Switch disabled checked />
    </div>
  ),
};
