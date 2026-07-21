import type { DriveStep } from "driver.js";

export const CREATE_TASK_TOUR_STEP_TARGETS = [
  "create-task-basics",
  "create-task-meta",
  "create-task-schedule",
  "create-task-steps",
] as const;

export type CreateTaskTourStepTarget = (typeof CREATE_TASK_TOUR_STEP_TARGETS)[number];

export const createTaskTourSteps: DriveStep[] = [
  {
    element: "[data-tour='create-task-basics']",
    popover: {
      title: "Título e descrição",
      description:
        "Dê um nome curto para a tarefa e, se quiser, adicione uma descrição com mais detalhes.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='create-task-meta']",
    popover: {
      title: "Prioridade e categoria",
      description:
        "Escolha o quanto essa tarefa é importante e a que área da sua rotina ela pertence.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='create-task-schedule']",
    popover: {
      title: "Data e hora",
      description: "Defina quando a tarefa deve ser feita.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='create-task-steps']",
    popover: {
      title: "Passos da tarefa",
      description:
        "Divida a tarefa em passos simples. Eles serão usados no Modo Guiado para te acompanhar um a um.",
      side: "top",
      align: "start",
    },
  },
];
