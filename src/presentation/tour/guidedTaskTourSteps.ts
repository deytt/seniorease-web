import type { DriveStep } from "driver.js";

export const GUIDED_TASK_TOUR_STEP_TARGETS = [
  "guided-header",
  "guided-progress",
  "guided-step-card",
  "guided-tip",
  "guided-nav",
] as const;

export type GuidedTaskTourStepTarget = (typeof GUIDED_TASK_TOUR_STEP_TARGETS)[number];

export const guidedTaskTourSteps: DriveStep[] = [
  {
    element: "[data-tour='guided-header']",
    popover: {
      title: "Modo Guiado",
      description:
        "Nesta tela você faz a tarefa um passo de cada vez, com calma. O título acima mostra qual tarefa está em andamento.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='guided-progress']",
    popover: {
      title: "Seu progresso",
      description:
        "Acompanhe em qual passo você está e quanto já foi concluído da tarefa.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='guided-step-card']",
    popover: {
      title: "Passo atual",
      description:
        "Aqui aparece a instrução do passo em que você está agora. Leia com calma antes de continuar.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-tour='guided-tip']",
    popover: {
      title: "Como confirmar um passo",
      description:
        "Ao tocar em Próximo Passo, você confirma que concluiu o passo atual. Você pode voltar para revisar passos já vistos.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='guided-nav']",
    popover: {
      title: "Continuar ou concluir",
      description:
        "Use Passo Anterior para voltar ou o botão da direita para avançar até concluir a tarefa.",
      side: "top",
      align: "start",
    },
  },
];
