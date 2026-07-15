import type { DriveStep } from "driver.js";

export const PROFILE_TOUR_STEP_TARGETS = [
  "profile-photo",
  "profile-account-status",
  "profile-help",
  "profile-personal-info",
  "profile-address",
  "profile-notifications",
  "profile-account-support",
] as const;

export type ProfileTourStepTarget = (typeof PROFILE_TOUR_STEP_TARGETS)[number];

export const profileTourSteps: DriveStep[] = [
  {
    element: "[data-tour='profile-photo']",
    popover: {
      title: "Sua foto de perfil",
      description:
        "Toque em Editar Foto de Perfil para escolher uma imagem do seu dispositivo. Isso ajuda a identificar sua conta.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-tour='profile-account-status']",
    popover: {
      title: "Status da conta",
      description:
        "Aqui você acompanha desde quando faz parte do SeniorEase, quantas atividades concluiu e sua melhor sequência.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='profile-help']",
    popover: {
      title: "Precisa de ajuda?",
      description:
        "Se tiver dúvidas, ligue para 1-800-SENIOR. Nossa equipe está pronta para ajudar com calma e clareza.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='profile-personal-info']",
    popover: {
      title: "Informações pessoais",
      description:
        "Confira seu nome, data de nascimento e telefone. Toque em Editar para atualizar esses dados quando precisar.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='profile-address']",
    popover: {
      title: "Endereço",
      description:
        "Seu endereço completo aparece aqui. Use Editar para manter rua, bairro, cidade e CEP sempre corretos.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='profile-notifications']",
    popover: {
      title: "Preferências de notificação",
      description:
        "Veja como estão os avisos de tarefas e lembretes. Em Editar, você escolhe quando quer ser lembrado.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='profile-account-support']",
    popover: {
      title: "Conta e suporte",
      description:
        "Em Segurança você verifica seu e-mail e altera a senha. Em Sobre, conhece mais sobre o SeniorEase.",
      side: "top",
      align: "start",
    },
  },
];
