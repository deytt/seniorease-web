import type { DriveStep } from "driver.js";

export const ADDRESS_TOUR_ID = "address";

export const addressTourSteps: DriveStep[] = [
  {
    element: "[data-tour='profile-form-header']",
    popover: {
      title: "Endereço",
      description:
        "Mais abaixo nesta mesma tela você informa o endereço completo, se quiser.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='edit-address']",
    popover: {
      title: "Campos de endereço",
      description:
        "Preencha bairro, rua, número, CEP, cidade, estado e país. Nada aqui é obrigatório.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "[data-tour='edit-save']",
    popover: {
      title: "Salvar endereço",
      description:
        "Depois de preencher, toque em salvar para guardar o endereço junto com os outros dados.",
      side: "top",
      align: "start",
    },
  },
];
