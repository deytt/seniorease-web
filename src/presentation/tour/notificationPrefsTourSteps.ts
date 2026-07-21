import type { DriveStep } from "driver.js";

export const NOTIFICATION_PREFS_TOUR_ID = "notificationPreferences";

export const notificationPrefsTourSteps: DriveStep[] = [
  {
    element: "[data-tour='profile-form-header']",
    popover: {
      title: "Preferências de notificação",
      description:
        "Aqui você escolhe se quer avisos de tarefas e lembretes, e com quanto tempo de antecedência.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='notif-tasks']",
    popover: {
      title: "Avisos de tarefas",
      description:
        "Ligue ou desligue os avisos de tarefas e escolha quanto tempo antes você quer ser lembrado.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='notif-reminders']",
    popover: {
      title: "Avisos de lembretes",
      description:
        "Faça o mesmo para os lembretes: ative, desative e ajuste o horário do aviso.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='notif-save']",
    popover: {
      title: "Salvar alterações",
      description:
        "Quando terminar de ajustar, toque aqui para guardar as preferências.",
      side: "top",
      align: "start",
    },
  },
];
