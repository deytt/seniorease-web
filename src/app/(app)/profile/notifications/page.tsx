import { redirect } from "next/navigation";

/**
 * Rota legada — preferências canônicas em `/profile/notifications/edit` (issue #59).
 */
export default function NotificationPreferencesRedirectPage() {
  redirect("/profile/notifications/edit");
}
