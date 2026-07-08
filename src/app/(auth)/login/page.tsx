import { AuthLayout } from "@/presentation/components/layout/authLayout";
import { LoginForm } from "@/presentation/components/auth/loginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bem-vindo ao SeniorEase"
      subtitle="Acesse sua conta para continuar."
      footer={
        <>
          Precisa de ajuda? Ligue para{" "}
          <a
            href="tel:1-800-736467"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            1-800-SENIOR
          </a>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
