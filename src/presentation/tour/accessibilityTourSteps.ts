import type { DriveStep } from "driver.js";

export const ACCESSIBILITY_TOUR_STEP_TARGETS = [
  "a11y-header",
  "a11y-font",
  "a11y-mode",
  "a11y-spacing",
  "a11y-toggles",
  "a11y-reset",
] as const;

export type AccessibilityTourStepTarget =
  (typeof ACCESSIBILITY_TOUR_STEP_TARGETS)[number];

export const accessibilityTourSteps: DriveStep[] = [
  {
    element: "[data-tour='a11y-header']",
    popover: {
      title: "Configurações de Acessibilidade",
      description:
        "Nesta página você ajusta o tamanho da letra, o modo de uso e outros atalhos. As mudanças são salvas automaticamente.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='a11y-font']",
    popover: {
      title: "Tamanho da letra",
      description:
        "Arraste o controle para deixar o texto maior ou menor, do jeito que você lê melhor.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='a11y-mode']",
    popover: {
      title: "Modo de uso",
      description:
        "Escolha o Modo Básico para uma tela mais simples, ou Avançado para ver tudo.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='a11y-spacing']",
    popover: {
      title: "Espaçamento",
      description:
        'Escolha quanto espaço quer entre os elementos. "Espaçoso" dá mais respiro à tela.',
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='a11y-toggles']",
    popover: {
      title: "Ajustes rápidos",
      description:
        "Ligue ou desligue o modo escuro, alto contraste, sons e botões maiores.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='a11y-reset']",
    popover: {
      title: "Redefinir padrões",
      description:
        "Se quiser voltar às configurações originais, toque aqui. O app pedirá confirmação antes de mudar.",
      side: "top",
      align: "start",
    },
  },
];
