import type { DriveStep } from "driver.js";

export const TASKS_LIST_TOUR_STEP_TARGETS = [
  "tasks-header",
  "tasks-search",
  "tasks-filter",
  "tasks-list",
] as const;

export type TasksListTourStepTarget = (typeof TASKS_LIST_TOUR_STEP_TARGETS)[number];

export const tasksListTourSteps: DriveStep[] = [
  {
    element: "[data-tour='tasks-header']",
    popover: {
      title: "Minhas Tarefas",
      description:
        "Esta é a lista completa das suas tarefas. Toque em Nova Tarefa para adicionar mais uma.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='tasks-search']",
    popover: {
      title: "Pesquisar tarefas",
      description:
        "Digite parte do título de uma tarefa aqui para encontrá-la rapidamente.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='tasks-filter']",
    popover: {
      title: "Filtrar tarefas",
      description:
        "Toque aqui para mostrar só as tarefas de hoje, ou filtrar por categoria e prioridade.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='tasks-list']",
    popover: {
      title: "Suas tarefas",
      description:
        "Cada cartão mostra o título, horário e categoria da tarefa. Toque em Detalhes para ver mais ou em Modo Guiado para seguir os passos.",
      side: "top",
      align: "start",
    },
  },
];
