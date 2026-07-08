import Link from "next/link";
import { CheckCircle2, LayoutDashboard } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

const readyItems = [
  "Seu painel com as tarefas de hoje",
  "Notificações de lembretes já ativas",
  "Familiares podem ser adicionados nas configurações",
  "Contatos de emergência prontos para configurar",
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
        está pronta e tudo já foi configurado para você.
      </p>

      <ul className="w-full rounded-2xl border border-border bg-secondary p-6 text-left">
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
