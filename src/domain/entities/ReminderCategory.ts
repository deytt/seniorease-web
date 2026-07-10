/**
 * Categorias de lembrete — espelha 1:1 o mobile e firebaseSchema.md.
 * Valores persistidos no Firestore = o literal da união.
 */
export type ReminderCategory =
  | "medication"
  | "appointment"
  | "hydration"
  | "meal"
  | "bills";

export const REMINDER_CATEGORIES: ReminderCategory[] = [
  "medication",
  "appointment",
  "hydration",
  "meal",
  "bills",
];

export const REMINDER_CATEGORY_LABELS: Record<ReminderCategory, string> = {
  medication: "Medicação",
  appointment: "Consulta",
  hydration: "Hidratação",
  meal: "Alimentação",
  bills: "Contas e Pagamentos",
};

/** Fallback seguro para valores legados/desconhecidos (ex.: "general"). */
export function parseReminderCategory(value: unknown): ReminderCategory {
  if (
    typeof value === "string" &&
    (REMINDER_CATEGORIES as string[]).includes(value)
  ) {
    return value as ReminderCategory;
  }
  return "medication";
}
