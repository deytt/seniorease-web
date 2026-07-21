import type { DriveStep } from "driver.js";

export const TASK_DETAILS_TOUR_STEP_TARGETS = [
  "task-details-header",
  "task-details-steps",
  "task-details-actions",
] as const;

export type TaskDetailsTourStepTarget = (typeof TASK_DETAILS_TOUR_STEP_TARGETS)[number];

export const taskDetailsTourSteps: DriveStep[] = [
  {
    element: "[data-tour='task-details-header']",
    popover: {
      title: "Detalhes da tarefa",
      description:
        "Aqui você vê o título, a prioridade, a categoria e o status da tarefa.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='task-details-steps']",
    popover: {
      title: "Checklist passo a passo",
      description:
        "Se a tarefa tiver passos, eles aparecem aqui em ordem, para você acompanhar o que já foi feito.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='task-details-actions']",
    popover: {
      title: "Ações da tarefa",
      description:
        "Use Modo Guiado para seguir os passos com calma, ou Concluir Tarefa quando terminar tudo.",
      side: "top",
      align: "start",
    },
  },
];
