import type { DriveStep } from "driver.js";

export const REMINDERS_LIST_TOUR_STEP_TARGETS = [
  "reminders-header",
  "reminders-create",
  "reminders-filter",
  "reminders-list",
] as const;

export type RemindersListTourStepTarget = (typeof REMINDERS_LIST_TOUR_STEP_TARGETS)[number];

export const remindersListTourSteps: DriveStep[] = [
  {
    element: "[data-tour='reminders-header']",
    popover: {
      title: "Central de Lembretes",
      description:
        "Aqui ficam todos os seus lembretes e quantos ainda estão pendentes para hoje.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='reminders-create']",
    popover: {
      title: "Novo lembrete",
      description: "Toque aqui para criar um lembrete novo.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "[data-tour='reminders-filter']",
    popover: {
      title: "Filtrar lembretes",
      description:
        "Escolha Hoje, Medicação ou Consultas. Só um filtro fica ativo de cada vez, como no aplicativo do celular.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='reminders-list']",
    popover: {
      title: "Seus lembretes",
      description:
        "Cada cartão mostra o horário e a categoria. Você pode marcar como concluído, editar ou excluir.",
      side: "top",
      align: "start",
    },
  },
];
