import type { DriveStep } from "driver.js";

export const PERSONAL_INFO_TOUR_ID = "personalInfo";

export const personalInfoTourSteps: DriveStep[] = [
  {
    element: "[data-tour='profile-form-header']",
    popover: {
      title: "Informações pessoais",
      description:
        "Nesta tela você atualiza seus dados principais. Os campos com * são obrigatórios.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='edit-personal']",
    popover: {
      title: "Seus dados",
      description:
        "Preencha nome, data de nascimento, telefone e, se quiser, o CPF. No Modo Básico o CPF fica oculto.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='edit-save']",
    popover: {
      title: "Salvar alterações",
      description:
        "Quando terminar, toque em Salvar alterações para guardar as mudanças com segurança.",
      side: "top",
      align: "center",
    },
  },
];
