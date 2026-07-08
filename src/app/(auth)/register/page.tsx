import { AuthLayout } from "@/presentation/components/layout/authLayout";
import { RegisterForm } from "@/presentation/components/auth/registerForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Criar sua conta"
      subtitle="Junte-se ao SeniorEase e organize seu dia com autonomia."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
