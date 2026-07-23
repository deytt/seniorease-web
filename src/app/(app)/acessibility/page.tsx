import { redirect } from "next/navigation";

/**
 * Compatibilidade com a grafia antiga da rota.
 */
export default function LegacyAccessibilityRedirectPage() {
  redirect("/accessibility");
}
