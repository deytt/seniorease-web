import { AuthLayout } from "@/presentation/components/layout/authLayout";
import { ForgotPasswordForm } from "@/presentation/components/auth/forgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Esqueceu sua senha?"
      subtitle="Sem problemas! Informe seu e-mail e enviaremos um link para redefinir sua senha."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
