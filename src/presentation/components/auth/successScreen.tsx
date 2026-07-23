import Link from "next/link";
import { CheckCircle2, LayoutDashboard } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

const readyItems = [
  "Seu painel pronto para organizar o dia",
  "Você pode criar tarefas e lembretes quando quiser",
  "Preferências de acessibilidade disponíveis nas configurações",
  "Contatos e perfil podem ser completados a qualquer momento",
];

interface SuccessScreenProps {
  userName?: string;
}

export function SuccessScreen({ userName }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <CheckCircle2 aria-hidden="true" className="size-16 text-success" />

      <p className="text-lg text-muted-foreground">
        Bem-vindo(a) ao SeniorEase{userName ? `, ${userName}` : ""}. Sua conta
        foi criada com sucesso. Vamos começar com o que você precisar.
      </p>

      <ul className="w-full rounded-2xl border border-border bg-muted p-6 text-left">
        {readyItems.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 py-2 text-base text-foreground"
          >
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-success"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Button asChild size="lg" className="w-full">
        <Link href="/dashboard">
          <LayoutDashboard aria-hidden="true" />
          Ir para o meu painel
        </Link>
      </Button>
    </div>
  );
}
