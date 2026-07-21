export type TourCatalogItem = {
  id: string;
  title: string;
  description: string;
  route: string;
};

/**
 * Catálogo da tela "Guia do aplicativo".
 * Novos tours devem ser adicionados aqui (branches de tour).
 */
export const TOUR_CATALOG: TourCatalogItem[] = [
  {
    id: "profile",
    title: "Perfil",
    description: "Conheça a foto, os dados pessoais, o endereço e a segurança da conta.",
    route: "/profile",
  },
  {
    id: "history",
    title: "Histórico",
    description: "Veja as estatísticas e a atividade recente das suas tarefas e lembretes.",
    route: "/history",
  },
];

export function getTourCatalogItem(tourId: string): TourCatalogItem | undefined {
  return TOUR_CATALOG.find((item) => item.id === tourId);
}
