import type { DriveStep } from "driver.js";

export const DASHBOARD_TOUR_STEP_TARGETS = [
  "dashboard-header",
  "dashboard-today-tasks",
  "dashboard-quick-actions",
  "dashboard-reminders",
] as const;

export type DashboardTourStepTarget = (typeof DASHBOARD_TOUR_STEP_TARGETS)[number];

export const dashboardTourSteps: DriveStep[] = [
  {
    element: "[data-tour='dashboard-header']",
    popover: {
      title: "Bem-vindo ao seu painel",
      description:
        "Aqui você vê um resumo do seu dia. Neste tour, mostramos cada área com calma. Pode pausar ou sair quando quiser.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='dashboard-today-tasks']",
    popover: {
      title: "Tarefas de hoje",
      description:
        "Veja as tarefas marcadas para hoje. Toque em Adicionar tarefa para criar uma nova ou em Ver todas as tarefas para a lista completa.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='dashboard-quick-actions']",
    popover: {
      title: "Ações rápidas",
      description:
        "Atalhos para criar uma tarefa, ajustar a acessibilidade, ver seus lembretes ou pedir ajuda rápida.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='dashboard-reminders']",
    popover: {
      title: "Lembretes próximos",
      description:
        "Os próximos lembretes aparecem aqui. Toque em Gerenciar lembretes para ver ou criar novos.",
      side: "left",
      align: "start",
    },
  },
];
