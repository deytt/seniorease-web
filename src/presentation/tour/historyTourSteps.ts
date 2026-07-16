import type { DriveStep } from "driver.js";

export const HISTORY_TOUR_STEP_TARGETS = [
  "history-header",
  "history-stats",
  "history-activity",
] as const;

export type HistoryTourStepTarget = (typeof HISTORY_TOUR_STEP_TARGETS)[number];

export const historyTourSteps: DriveStep[] = [
  {
    element: "[data-tour='history-header']",
    popover: {
      title: "Histórico de Atividades",
      description:
        "Aqui você acompanha seu progresso e vê um resumo do quanto tem sido consistente nas suas rotinas.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='history-stats']",
    popover: {
      title: "Seus números",
      description:
        "Estes cards mostram tarefas da semana, sua sequência de dias, conquistas e lembretes concluídos. Quando você mantém uma sequência de 3 dias ou mais, um destaque especial aparece abaixo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-tour='history-activity']",
    popover: {
      title: "Atividade recente",
      description:
        "Cada linha registra algo que você fez no app — concluir tarefas, lembretes, conquistas e muito mais. No modo avançado, você vê ainda mais detalhes.",
      side: "top",
      align: "start",
    },
  },
];
