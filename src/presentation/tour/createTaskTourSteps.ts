import type { DriveStep } from "driver.js";

export const CREATE_TASK_TOUR_STEP_TARGETS = [
  "create-task-header",
  "create-task-basics",
  "create-task-meta",
  "create-task-schedule",
  "create-task-steps",
  "create-task-submit",
] as const;

export type CreateTaskTourStepTarget = (typeof CREATE_TASK_TOUR_STEP_TARGETS)[number];

export const createTaskTourSteps: DriveStep[] = [
  {
    element: "[data-tour='create-task-header']",
    popover: {
      title: "Nova Tarefa",
      description:
        "Nesta página você cria uma tarefa completa. Vamos passar pelos campos principais e pelo botão de salvar.",
      side: "bottom",
      align: "start",
    },
  },
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
  {
    element: "[data-tour='create-task-submit']",
    popover: {
      title: "Criar tarefa",
      description:
        "Quando terminar de preencher, toque aqui para salvar a nova tarefa.",
      side: "top",
      align: "end",
    },
  },
];
