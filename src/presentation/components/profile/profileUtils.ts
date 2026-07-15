import type { Address } from "@/domain/entities/Address";
import { isAddressEmpty } from "@/domain/entities/Address";
import type { User } from "@/domain/entities/User";
import type { UserPreferences } from "@/domain/entities/UserPreferences";
import { NOTIFICATION_OFFSET_OPTIONS } from "@/domain/entities/UserPreferences";
import { maskPhone } from "@/lib/inputMasks";

export function getProfileInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatMemberSince(date: Date | undefined): string {
  if (!date) return "—";
  const formatted = date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatProfileValue(value?: string | null): string {
  return value?.trim() ? value.trim() : "—";
}

export function formatBirthDateDisplay(value?: string | null): string {
  if (!value?.trim()) return "—";
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return value.trim();

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return value.trim();

  const formatted = date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatStreakDays(streak: number): string {
  if (streak <= 0) return "—";
  return streak === 1 ? "1 dia" : `${streak} dias`;
}

function formatNotificationStatus(
  enabled: boolean,
  offset: UserPreferences["taskNotificationOffset"],
): string {
  if (!enabled) return "Desativado";
  const label =
    NOTIFICATION_OFFSET_OPTIONS.find((option) => option.value === offset)
      ?.label ?? offset;
  return `Ativado — ${label}`;
}

export function getNotificationSummary(preferences: UserPreferences) {
  return {
    taskNotifications: formatNotificationStatus(
      preferences.tasksNotificationsEnabled,
      preferences.taskNotificationOffset,
    ),
    reminderNotifications: formatNotificationStatus(
      preferences.remindersNotificationsEnabled,
      preferences.reminderNotificationOffset,
    ),
  };
}

export function getProfilePhoneDisplay(user: User): string {
  if (!user.phone?.trim()) return "—";
  return maskPhone(user.phone);
}

export function formatAddressDisplay(address: Address | null | undefined): string {
  if (!address || isAddressEmpty(address)) return "—";

  const streetLine = [address.street, address.number]
    .filter((part) => part.trim())
    .join(", ");
  const cityLine = [address.neighborhood, address.city, address.state]
    .filter((part) => part.trim())
    .join(" — ");
  const zipLine = address.zipCode.trim() ? `CEP ${address.zipCode}` : "";
  const countryLine = address.country.trim();

  return [streetLine, cityLine, zipLine, countryLine]
    .filter((part) => part.length > 0)
    .join(" · ");
}
