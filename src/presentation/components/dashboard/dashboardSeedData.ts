import type { TaskCategory, TaskPriority } from "@/domain/entities/Task";
import type { ReminderCategory } from "@/domain/entities/ReminderCategory";
import { getRemindersDi } from "@/lib/di/remindersDi";
import { getTasksDi } from "@/lib/di/tasksDi";

const DASHBOARD_SEED_STORAGE_KEY = "seniorease_dashboard_seeded";

export interface DashboardSeedResult {
  tasksCreated: number;
  remindersCreated: number;
}

interface DemoTaskSeed {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: Date;
  status: "pending" | "completed";
  completedAt?: Date;
  steps?: Array<{ order: number; title: string; instruction: string }>;
}

interface DemoReminderSeed {
  title: string;
  message: string;
  category: ReminderCategory;
  scheduledAt: Date;
}

function setTimeOnDate(base: Date, hours: number, minutes = 0): Date {
  const copy = new Date(base);
  copy.setHours(hours, minutes, 0, 0);
  return copy;
}

function buildDemoTasks(now: Date): DemoTaskSeed[] {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      title: "Tomar remédio da manhã",
      description: "Tomar com um copo de água após o café da manhã.",
      category: "medication",
      priority: "high",
      dueDate: setTimeOnDate(now, 8, 0),
      status: "completed",
      completedAt: setTimeOnDate(now, 8, 5),
    },
    {
      title: "Ligar para consultório médico",
      description: "Confirmar horário da consulta de acompanhamento.",
      category: "health",
      priority: "high",
      dueDate: setTimeOnDate(now, 10, 0),
      status: "pending",
      steps: [
        {
          order: 1,
          title: "Pegar o telefone",
          instruction: "Use o telefone fixo ou celular.",
        },
        {
          order: 2,
          title: "Discar o número",
          instruction: "Número está na agenda de contatos.",
        },
      ],
    },
    {
      title: "Caminhada no jardim",
      description: "Caminhada leve de 20 minutos.",
      category: "exercise",
      priority: "medium",
      dueDate: setTimeOnDate(now, 11, 0),
      status: "pending",
    },
    {
      title: "Videochamada com a família",
      description: "Conversar com filhos e netos.",
      category: "social",
      priority: "low",
      dueDate: setTimeOnDate(now, 14, 0),
      status: "pending",
    },
    {
      title: "Organizar documentos pessoais",
      description: "Separar receitas e exames recentes.",
      category: "personal",
      priority: "medium",
      dueDate: setTimeOnDate(yesterday, 16, 0),
      status: "completed",
      completedAt: setTimeOnDate(yesterday, 16, 30),
    },
    {
      title: "Alongamento leve",
      description: "Exercícios de mobilidade antes do almoço.",
      category: "exercise",
      priority: "low",
      dueDate: setTimeOnDate(yesterday, 11, 30),
      status: "completed",
      completedAt: setTimeOnDate(yesterday, 11, 45),
    },
  ];
}

function buildDemoReminders(now: Date): DemoReminderSeed[] {
  const laterToday = new Date(now);
  laterToday.setHours(now.getHours() + 2, 0, 0, 0);

  const tomorrowMorning = new Date(now);
  tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
  tomorrowMorning.setHours(9, 0, 0, 0);

  return [
    {
      title: "Tomar vitamina D",
      message: "Tomar após o almoço.",
      category: "medication",
      scheduledAt: laterToday,
    },
    {
      title: "Beber água",
      message: "Meta de hidratação da tarde.",
      category: "hydration",
      scheduledAt: new Date(now.getTime() + 60 * 60 * 1000),
    },
    {
      title: "Consulta de rotina",
      message: "Preparar documentos para a consulta.",
      category: "appointment",
      scheduledAt: tomorrowMorning,
    },
  ];
}

export function hasDashboardDemoSeed(userId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${DASHBOARD_SEED_STORAGE_KEY}:${userId}`) === "1";
}

export function markDashboardDemoSeeded(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${DASHBOARD_SEED_STORAGE_KEY}:${userId}`, "1");
}

export async function seedDashboardDemoData(
  userId: string,
  now: Date = new Date(),
): Promise<DashboardSeedResult> {
  const { createTaskUseCase, taskRepository } = getTasksDi();
  const { createReminderUseCase } = getRemindersDi();

  let tasksCreated = 0;
  let remindersCreated = 0;

  for (const demoTask of buildDemoTasks(now)) {
    const created = await createTaskUseCase.execute({
      userId,
      title: demoTask.title,
      description: demoTask.description,
      category: demoTask.category,
      priority: demoTask.priority,
      dueDate: demoTask.dueDate,
      steps: demoTask.steps ?? [],
    });

    if (demoTask.status === "completed") {
      await taskRepository.updateTask(created.id, {
        status: "completed",
        completedAt: demoTask.completedAt ?? demoTask.dueDate,
      });
    }

    tasksCreated += 1;
  }

  for (const demoReminder of buildDemoReminders(now)) {
    await createReminderUseCase.execute({
      userId,
      title: demoReminder.title,
      message: demoReminder.message,
      category: demoReminder.category,
      scheduledAt: demoReminder.scheduledAt,
    });
    remindersCreated += 1;
  }

  markDashboardDemoSeeded(userId);
  return { tasksCreated, remindersCreated };
}
