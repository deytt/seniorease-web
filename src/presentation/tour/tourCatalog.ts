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
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "Conheça a próxima atividade, as ações rápidas, o status de acessibilidade e os lembretes de hoje.",
    route: "/dashboard",
  },
  {
    id: "tasksList",
    title: "Minhas Tarefas",
    description: "Veja como pesquisar, filtrar e abrir os detalhes das suas tarefas.",
    route: "/tasks",
  },
  {
    id: "createTask",
    title: "Nova Tarefa",
    description: "Aprenda a preencher título, prioridade, data e passos de uma tarefa.",
    route: "/tasks/create",
  },
  {
    id: "taskDetails",
    title: "Detalhes da Tarefa",
    description: "Veja o checklist de passos e as ações disponíveis em uma tarefa.",
    route: "/tasks",
  },
  {
    id: "remindersList",
    title: "Central de Lembretes",
    description: "Veja como filtrar por Hoje, Medicação ou Consultas e gerenciar seus lembretes.",
    route: "/reminders",
  },
  {
    id: "createReminder",
    title: "Novo Lembrete",
    description: "Aprenda a preencher título, categoria e horário de um lembrete.",
    route: "/reminders/create",
  },
  {
    id: "guidedTask",
    title: "Modo Guiado",
    description: "Veja como acompanhar o progresso e confirmar cada passo com calma.",
    route: "/tasks/guided",
  },
  {
    id: "notifications",
    title: "Notificações",
    description: "Veja os avisos enviados sobre suas tarefas e lembretes.",
    route: "/notifications",
  },
  {
    id: "accessibility",
    title: "Acessibilidade",
    description: "Ajuste o tamanho da letra, o modo de uso, o espaçamento e outros atalhos.",
    route: "/acessibility",
  },
  {
    id: "security",
    title: "Segurança",
    description: "Veja como verificar o e-mail e alterar a senha da conta.",
    route: "/profile/security",
  },
  {
    id: "about",
    title: "Sobre o SeniorEase",
    description: "Conheça o propósito do app, a versão e a aplicação web.",
    route: "/about",
  },
  {
    id: "personalInfo",
    title: "Informações Pessoais",
    description: "Aprenda a atualizar nome, telefone e outros dados pessoais.",
    route: "/profile/edit",
  },
  {
    id: "notificationPreferences",
    title: "Preferências de Notificação",
    description: "Escolha avisos de tarefas e lembretes e a antecedência.",
    route: "/profile/notifications/edit",
  },
];

export function getTourCatalogItem(tourId: string): TourCatalogItem | undefined {
  return TOUR_CATALOG.find((item) => item.id === tourId);
}
