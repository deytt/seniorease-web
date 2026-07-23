"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, RefreshCw } from "lucide-react";
import { toast } from "@/presentation/lib/feedbackToast";
import { Button } from "@/presentation/components/ui/button";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import {
  getReloadEmailVerificationUseCase,
  getSendEmailVerificationUseCase,
} from "@/lib/di/authDi";

interface EmailVerificationFormProps {
  onSuccess?: () => void;
}

export function EmailVerificationForm({ onSuccess }: EmailVerificationFormProps) {
  const router = useRouter();
  const { user, refreshUser } = useAuthContext();
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const isVerified = user?.emailVerified ?? false;

  async function handleSendVerification() {
    setIsSending(true);
    try {
      const sendEmailVerificationUseCase = getSendEmailVerificationUseCase();
      await sendEmailVerificationUseCase.execute();
      toast.success("E-mail de verificação enviado! Confira sua caixa de entrada.");
    } catch (err) {
      console.error("Erro ao enviar verificação:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível enviar o e-mail. Tente novamente.";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  }

  async function handleCheckVerification() {
    setIsChecking(true);
    try {
      if (!user?.id) {
        toast.error("Sessão inválida. Faça login novamente.");
        return;
      }

      const reloadEmailVerificationUseCase = getReloadEmailVerificationUseCase();
      const verified = await reloadEmailVerificationUseCase.execute(user.id);
      await refreshUser();

      if (verified) {
        toast.success("E-mail verificado com sucesso!");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/profile");
        }
      } else {
        toast.info(
          "Ainda não encontramos a verificação. Abra o link no e-mail e tente de novo.",
        );
      }
    } catch (err) {
      console.error("Erro ao verificar e-mail:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível verificar o e-mail. Tente novamente.";
      toast.error(message);
    } finally {
      setIsChecking(false);
    }
  }

  if (isVerified) {
    return (
      <div className="space-y-6">
        <div className="rounded-[14px] border border-success/30 bg-success/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-success"
              aria-hidden
            />
            <div>
              <p className="text-base font-semibold text-foreground">
                E-mail verificado
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Sua conta está confirmada. Você pode usar todos os recursos com
                tranquilidade.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer rounded-[14px]"
          onClick={() => router.push("/profile")}
        >
          Voltar para o Perfil
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[14px] border border-border bg-muted p-4">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-base font-semibold text-foreground">
              Confirme seu e-mail
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Enviaremos um link para{" "}
              <strong className="font-medium text-foreground">
                {user?.email ?? "seu e-mail"}
              </strong>
              . Abra o link no e-mail e depois volte aqui para confirmar.
            </p>
          </div>
        </div>
      </div>

      <Button
        type="button"
        className="w-full cursor-pointer rounded-[14px]"
        size="lg"
        onClick={handleSendVerification}
        disabled={isChecking}
        loading={isSending}
        loadingText="Enviando..."
      >
        Enviar e-mail de verificação
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer rounded-[14px]"
        onClick={handleCheckVerification}
        disabled={isSending}
        loading={isChecking}
        loadingText="Verificando..."
      >
        <RefreshCw className="size-4" aria-hidden />
        Já confirmei — verificar agora
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full cursor-pointer rounded-[14px] text-muted-foreground"
        onClick={() => router.push("/profile")}
        disabled={isSending || isChecking}
      >
        Cancelar
      </Button>
    </div>
  );
}
