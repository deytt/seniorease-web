"use client";

import Link from "next/link";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { CreateReminderForm } from "@/presentation/components/reminders/createReminderForm";

export default function CreateReminderPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-20">
      <Link href="/reminders">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 cursor-pointer rounded-[14px]"
        >
          <ChevronLeft className="size-4 mr-2" />
          Voltar para Lembretes
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[#0f172a]">Novo Lembrete</h1>
        <p className="text-base text-[#64748b]">
          Configure um lembrete para ajudá-lo a ficar no caminho certo. Todos os
          campos marcados com * são obrigatórios.
        </p>
      </div>

      {/* Mesmo padrão visual dos cards da Central (Figma 16px + sombra suave) */}
      <Card className="rounded-2xl border border-[#e2e8f0] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
        <CardContent className="p-6">
          <CreateReminderForm />
        </CardContent>
      </Card>
    </div>
  );
}
