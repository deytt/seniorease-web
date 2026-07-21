import type { DriveStep } from "driver.js";

export const DASHBOARD_TOUR_STEP_TARGETS = [
  "dashboard-header",
  "dashboard-today-tasks",
  "dashboard-add-task",
  "dashboard-quick-actions",
  "dashboard-reminders",
  "dashboard-accessibility",
] as const;

export type DashboardTourStepTarget = (typeof DASHBOARD_TOUR_STEP_TARGETS)[number];

export const dashboardTourSteps: DriveStep[] = [
  {
    element: "[data-tour='dashboard-header']",
    popover: {
      title: "Bem-vindo ao seu Dashboard",
      description:
        "Aqui você vê um resumo do seu dia. Neste tour, mostramos cada área com calma. Pode pausar ou sair quando quiser.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='dashboard-today-tasks']",
    popover: {
      title: "Próxima atividade",
      description:
        "Aqui aparece a próxima tarefa pendente para você começar. Também há atalho para criar ou ver todas as tarefas.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='dashboard-add-task']",
    popover: {
      title: "Adicionar tarefa",
      description:
        "Toque aqui para criar uma nova tarefa quando quiser incluir algo no seu dia.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "[data-tour='dashboard-quick-actions']",
    popover: {
      title: "Ações rápidas",
      description:
        "Atalhos para criar uma tarefa, ajustar a acessibilidade, ver seus lembretes ou pedir ajuda rápida.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='dashboard-reminders']",
    popover: {
      title: "Lembretes de hoje",
      description:
        "Os lembretes do dia aparecem aqui. Toque em Gerenciar lembretes para ver ou criar novos.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='dashboard-accessibility']",
    popover: {
      title: "Status de acessibilidade",
      description:
        "Veja um resumo das suas preferências de leitura e toque. Em Ajustar configurações você muda o que precisar.",
      side: "top",
      align: "start",
    },
  },
];
