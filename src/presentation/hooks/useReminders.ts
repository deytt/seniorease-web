import { useState } from "react";
import { Reminder } from "@/domain/entities/Reminder";
import { IReminderRepository } from "@/domain/repositories/IReminderRepository";

export function useReminders(reminderRepository: IReminderRepository) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderRepository.getReminders(userId);
      setReminders(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar lembretes",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchReminderById = async (
    reminderId: string,
  ): Promise<Reminder | null> => {
    try {
      return await reminderRepository.getReminderById(reminderId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar lembrete",
      );
      return null;
    }
  };

  return {
    reminders,
    loading,
    error,
    fetchReminders,
    fetchReminderById,
  };
}
