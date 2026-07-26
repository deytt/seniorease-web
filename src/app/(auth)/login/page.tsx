import { AuthLayout } from "@/presentation/components/layout/authLayout";
import { LoginForm } from "@/presentation/components/auth/loginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta SeniorEase"
      footer={
        <>
          Precisa de ajuda? Ligue para{" "}
          <a
            href="tel:08006000300"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            0800 600 0300
          </a>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
