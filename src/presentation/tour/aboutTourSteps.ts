import type { DriveStep } from "driver.js";

export const ABOUT_TOUR_ID = "about";

export const aboutTourSteps: DriveStep[] = [
  {
    element: "[data-tour='about-purpose']",
    popover: {
      title: "Para que serve o SeniorEase",
      description:
        "Este bloco explica o propósito do aplicativo: facilitar o dia a dia com linguagem simples e botões grandes.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='about-version']",
    popover: {
      title: "Versão do aplicativo",
      description:
        "Aqui aparece a versão atual. É útil se precisar de ajuda ou quiser saber se está atualizado.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='about-web']",
    popover: {
      title: "Versão web",
      description:
        "Você está na versão para navegador. Dá para usar no computador ou no tablet.",
      side: "top",
      align: "start",
    },
  },
];
