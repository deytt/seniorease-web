import type { DriveStep } from "driver.js";

export const CREATE_REMINDER_TOUR_STEP_TARGETS = [
  "create-reminder-header",
  "create-reminder-basics",
  "create-reminder-category",
  "create-reminder-schedule",
  "create-reminder-submit",
] as const;

export type CreateReminderTourStepTarget = (typeof CREATE_REMINDER_TOUR_STEP_TARGETS)[number];

export const createReminderTourSteps: DriveStep[] = [
  {
    element: "[data-tour='create-reminder-header']",
    popover: {
      title: "Novo Lembrete",
      description:
        "Nesta página você cria um lembrete. Vamos passar pelos campos e pelo botão de salvar.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='create-reminder-basics']",
    popover: {
      title: "Título e mensagem",
      description:
        "Escreva um título curto e a mensagem que você quer receber quando o lembrete tocar.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='create-reminder-category']",
    popover: {
      title: "Categoria",
      description:
        "Escolha a que tipo de rotina esse lembrete pertence, como medicação ou consulta.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='create-reminder-schedule']",
    popover: {
      title: "Data e hora",
      description: "Defina o dia e a hora em que o aviso deve chegar.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='create-reminder-submit']",
    popover: {
      title: "Criar lembrete",
      description:
        "Depois de revisar tudo, toque aqui para salvar o seu lembrete.",
      side: "top",
      align: "start",
    },
  },
];
