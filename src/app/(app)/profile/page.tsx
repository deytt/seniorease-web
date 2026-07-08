"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Camera, Lock, Shield, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Implement Firebase Storage upload
      // For now, just show success message
      console.log("Photo upload started:", file.name);
      // After upload, you would update the user profile with the new photo URL
      alert("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      alert("Erro ao fazer upload da foto. Tente novamente.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground mb-4">
                {getInitials(user.name || "U")}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              <Button
                variant="outline"
                className="mt-4 w-full"
                size="sm"
                onClick={handlePhotoClick}
                disabled={isUploading}
              >
                <Camera className="size-4 mr-2" />
                {isUploading ? "Enviando..." : "Alterar Foto de Perfil"}
              </Button>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Membro desde
                </span>
                <span className="text-sm font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Plano</span>
                <span className="text-sm font-medium">Gratuito</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Atividades concluídas
                </span>
                <span className="text-sm font-bold">—</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Melhor sequência
                </span>
                <span className="text-sm font-bold">—</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Informações Pessoais</CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-blue-700 hover:bg-blue-50"
              >
                <Link href="/profile/edit">Editar</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Nome Completo
                  </p>
                  <p className="text-sm font-medium">{user.name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Data de Nascimento
                  </p>
                  <p className="text-sm font-medium">—</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Telefone
                  </p>
                  <p className="text-sm font-medium">—</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Contato de Emergência
                  </p>
                  <p className="text-sm font-medium">—</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Preferências de Notificação</CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-blue-700 hover:bg-blue-50"
              >
                <Link href="/acessibility">Editar</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Lembretes de Tarefas
                  </p>
                  <p className="text-sm font-medium">Ativado</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Alertas de Medicação
                  </p>
                  <p className="text-sm font-medium">Ativado</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Check-in Familiar
                  </p>
                  <p className="text-sm font-medium">—</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Conquistas
                  </p>
                  <p className="text-sm font-medium">Ativado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Link
                href="/profile/security"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="size-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Alterar Senha</span>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </Link>
              <div className="border-t" />
              <Link
                href="/profile/security"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="size-5 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Autenticação em Dois Fatores
                  </span>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />
    </div>
  );
}
