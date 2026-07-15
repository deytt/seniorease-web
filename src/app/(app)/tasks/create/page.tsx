"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { CreateTaskForm } from "@/presentation/components/tasks/createTaskForm";

export default function CreateTaskPage() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Header with Back Button */}
      <Link href="/tasks">
        <Button variant="ghost" size="sm" className="mb-6">
          <ChevronLeft className="size-4 mr-2" />
          Voltar para Tarefas
        </Button>
      </Link>

      {/* Title and Instructions */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nova Tarefa</h1>
        <p className="text-muted-foreground">
          Preencha os detalhes abaixo. Todos os campos marcados com * são
          obrigatórios.
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6">
          <CreateTaskForm formRef={formRef} />
        </CardContent>
      </Card>
    </div>
  );
}
