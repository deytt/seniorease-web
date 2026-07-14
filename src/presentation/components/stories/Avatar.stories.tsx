import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heart } from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/presentation/components/ui/avatar";

/**
 * `Avatar` exibe a foto (ou iniciais, como fallback) de uma pessoa. Suporta
 * três tamanhos (`sm` 24px, `default` 32px, `lg` 40px) e um selo opcional
 * (`AvatarBadge`) para indicar status (ex.: online, favorito).
 *
 * `AvatarGroup`/`AvatarGroupCount` empilham vários avatares com sobreposição,
 * úteis para mostrar "quem mais" está em uma lista (ex.: cuidadores de um
 * paciente), com um círculo final indicando quantos não aparecem.
 *
 * ## Como usar
 * - Sempre forneça `AvatarFallback` com iniciais legíveis para quando a
 *   imagem falhar ao carregar ou não existir.
 * - `AvatarImage` deve ter `alt` descritivo (nome da pessoa).
 */
const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Tamanho do avatar: sm (24px), default (32px), lg (40px).",
      table: { defaultValue: { summary: "default" } },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Avatar com imagem e fallback de iniciais. */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="Jane Doe" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/** Comparação de tamanhos. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/** Avatar com selo de status/favorito no canto inferior direito. */
export const WithBadge: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarFallback>JD</AvatarFallback>
      <AvatarBadge>
        <Heart className="size-2 fill-current" />
      </AvatarBadge>
    </Avatar>
  ),
};

/** Somente iniciais, sem imagem — o caso mais comum no produto. */
export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>MR</AvatarFallback>
    </Avatar>
  ),
};

/** Grupo de avatares sobrepostos com contador de "+N" restantes. */
export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>EF</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
};
