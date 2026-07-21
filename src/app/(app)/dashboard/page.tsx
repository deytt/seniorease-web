"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Reminder } from "@/domain/entities/Reminder";
import type { Task } from "@/domain/entities/Task";
import { defaultPreferences } from "@/domain/entities/UserPreferences";
import { getRemindersDi } from "@/lib/di/remindersDi";
import { getTasksDi } from "@/lib/di/tasksDi";
import { DashboardScreen } from "@/presentation/components/dashboard/dashboardScreen";
import {
  seedDashboardDemoData,
} from "@/presentation/components/dashboard/dashboardSeedData";
import { usePreferencesStore } from "@/presentation/providers/PreferencesProvider";
import { useAuthContext } from "@/presentation/providers/AuthProvider";

const EMPTY_TASKS: Task[] = [];
const EMPTY_REMINDERS: Reminder[] = [];

async function fetchTasksSafe(userId: string): Promise<Task[]> {
  try {
    return await getTasksDi().taskRepository.getTasks(userId);
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    toast.error("Não foi possível carregar as tarefas.");
    return [];
  }
}

async function fetchRemindersSafe(userId: string): Promise<Reminder[]> {
  try {
    return await getRemindersDi().reminderRepository.getReminders(userId);
  } catch (error) {
    console.error("Erro ao carregar lembretes:", error);
    toast.error("Não foi possível carregar os lembretes.");
    return [];
  }
}

async function fetchDashboardData(userId: string) {
  const [tasksData, remindersData] = await Promise.all([
    fetchTasksSafe(userId),
    fetchRemindersSafe(userId),
  ]);

  return { tasksData, remindersData };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthContext();
  const preferences =
    usePreferencesStore((s) => s.preferences) ??
    defaultPreferences(user?.id ?? "guest");

  const userId = user?.id ?? null;
  const [tasks, setTasks] = useState(EMPTY_TASKS);
  const [reminders, setReminders] = useState(EMPTY_REMINDERS);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [dataForUserId, setDataForUserId] = useState<string | null>(null);

  if (userId !== dataForUserId) {
    setDataForUserId(userId);
    setTasks(EMPTY_TASKS);
    setReminders(EMPTY_REMINDERS);
    setLoading(Boolean(userId));
  }

  const reloadDashboardData = useCallback(async (activeUserId: string) => {
    const { tasksData, remindersData } = await fetchDashboardData(activeUserId);
    setTasks(tasksData);
    setReminders(remindersData);
    return { tasksData, remindersData };
  }, []);

  const handleSeedDemoData = useCallback(async () => {
    if (!userId) return;

    setSeeding(true);
    try {
      await seedDashboardDemoData(userId);
      await reloadDashboardData(userId);
    } finally {
      setSeeding(false);
    }
  }, [reloadDashboardData, userId]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        let { tasksData, remindersData } = await fetchDashboardData(userId);

        if (!cancelled && tasksData.length === 0) {
          await seedDashboardDemoData(userId);
          ({ tasksData, remindersData } = await fetchDashboardData(userId));
        }

        if (!cancelled) {
          setTasks(tasksData);
          setReminders(remindersData);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (authLoading || !user) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center bg-[#f8fafc]"
        role="status"
        aria-live="polite"
      >
        <p className="text-base text-[#64748b]">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <DashboardScreen
      userId={user.id}
      userName={user.name}
      tasks={tasks}
      reminders={reminders}
      preferences={preferences}
      loading={loading || seeding}
      seeding={seeding}
      onSeedDemoData={handleSeedDemoData}
      showSeedAction={tasks.length === 0}
    />
  );
}
