import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Label } from "@/presentation/components/ui/label";
import { MaskedInput } from "@/presentation/components/ui/maskedInput";
import type { InputMaskType } from "@/lib/inputMasks";

const meta = {
  title: "Formulários/MaskedInput",
  component: MaskedInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Campo de entrada que reutiliza o \`Input\` real e formata progressivamente telefone, CPF, data de nascimento ou CEP.

### Quando usar
Somente quando o formato ajuda o usuário a reconhecer e revisar o dado digitado. O valor entregue por \`onValueChange\` permanece formatado.

### Quando evitar
Não use para dados livres ou como validação. Máscara e validação são responsabilidades diferentes.

### Acessibilidade
Sempre associe um \`Label\`, forneça \`inputMode\` adequado e mantenha exemplos de formato no texto de apoio ou placeholder. A máscara não deve apagar caracteres válidos inesperadamente durante a digitação.
        `,
      },
    },
  },
  argTypes: {
    mask: {
      control: "select",
      options: ["phone", "cpf", "birthDate", "zipCode"],
      description: "Formato aplicado progressivamente ao valor digitado.",
    },
  },
} satisfies Meta<typeof MaskedInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function MaskedInputDemo({
  mask,
  label,
  placeholder,
}: {
  mask: InputMaskType;
  label: string;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const id = `masked-${mask}`;

  return (
    <div className="w-full max-w-md space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <MaskedInput
        id={id}
        mask={mask}
        value={value}
        onValueChange={setValue}
        inputMode="numeric"
        placeholder={placeholder}
      />
      <p className="text-sm text-muted-foreground">
        Valor atual: {value || "nenhum valor digitado"}
      </p>
    </div>
  );
}

export const Telefone: Story = {
  render: () => (
    <MaskedInputDemo
      mask="phone"
      label="Telefone"
      placeholder="(11) 99999-9999"
    />
  ),
};

export const CPF: Story = {
  render: () => (
    <MaskedInputDemo mask="cpf" label="CPF" placeholder="000.000.000-00" />
  ),
};

export const DataDeNascimento: Story = {
  render: () => (
    <MaskedInputDemo
      mask="birthDate"
      label="Data de nascimento"
      placeholder="dd/mm/aaaa"
    />
  ),
};

export const CEP: Story = {
  render: () => (
    <MaskedInputDemo mask="zipCode" label="CEP" placeholder="00000-000" />
  ),
};
