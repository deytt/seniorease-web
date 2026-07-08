"use client";

import Link from "next/link";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import { EditProfileForm } from "@/presentation/components/profile/editProfileForm";

export default function EditProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="size-4 mr-2" />
              Voltar ao Perfil
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <User className="size-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Editar Perfil</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Atualize suas informações pessoais
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="p-6">
            <EditProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
