"use client";

import Link from "next/link";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { CreateReminderForm } from "@/presentation/components/reminders/createReminderForm";

export default function CreateReminderPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Header with Back Button */}
      <Link href="/reminders">
        <Button variant="ghost" size="sm" className="mb-6">
          <ChevronLeft className="size-4 mr-2" />
          Voltar para Lembretes
        </Button>
      </Link>

      {/* Title and Instructions */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Novo Lembrete</h1>
        <p className="text-muted-foreground">
          Configure um lembrete para ajudá-lo a ficar no caminho certo. Todos os
          campos marcados com * são obrigatórios.
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6">
          <CreateReminderForm />
        </CardContent>
      </Card>
    </div>
  );
}
