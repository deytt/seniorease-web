import { AuthLayout } from "@/presentation/components/layout/authLayout";
import { SuccessScreen } from "@/presentation/components/auth/successScreen";

export default function SuccessPage() {
  return (
    <AuthLayout title="Tudo pronto!">
      <SuccessScreen />
    </AuthLayout>
  );
}
