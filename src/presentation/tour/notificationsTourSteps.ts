import type { DriveStep } from "driver.js";

export const NOTIFICATIONS_TOUR_STEP_TARGETS = [
  "notifications-header",
  "notifications-list",
] as const;

export type NotificationsTourStepTarget = (typeof NOTIFICATIONS_TOUR_STEP_TARGETS)[number];

export const notificationsTourSteps: DriveStep[] = [
  {
    element: "[data-tour='notifications-header']",
    popover: {
      title: "Notificações",
      description:
        "Aqui ficam os avisos enviados sobre suas tarefas e lembretes.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='notifications-list']",
    popover: {
      title: "Seus avisos",
      description:
        "Toque em qualquer aviso para ir direto à tarefa ou ao lembrete relacionado.",
      side: "top",
      align: "start",
    },
  },
];
