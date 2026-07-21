import type { DriveStep } from "driver.js";

export const SECURITY_TOUR_ID = "security";

export const securityTourSteps: DriveStep[] = [
  {
    element: "[data-tour='profile-form-header']",
    popover: {
      title: "Segurança da conta",
      description:
        "Aqui você protege sua conta: confirma o e-mail e, se usar senha, pode alterá-la com calma.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='security-verify']",
    popover: {
      title: "Verificar conta",
      description:
        "Confirme seu e-mail para deixar a conta mais segura. O status aparece ao lado do botão.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='security-password']",
    popover: {
      title: "Alterar senha",
      description:
        "Se a sua conta usa senha, você pode trocá-la nesta área. Contas só com Google não precisam de senha aqui.",
      side: "top",
      align: "start",
    },
  },
];
