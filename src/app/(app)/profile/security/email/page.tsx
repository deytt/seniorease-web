import { redirect } from "next/navigation";

export default function EmailVerificationPage() {
  redirect("/profile/security");
}
