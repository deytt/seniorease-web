import { getNextPendingTask } from "@/presentation/components/dashboard/dashboardUtils";
import { getTasksDi } from "@/lib/di/tasksDi";

/**
 * Resolve a rota efetiva de um tour do Guia.
 * Alguns tours (ex.: detalhes da tarefa) precisam de um id dinâmico.
 */
export async function resolveTourRoute(
  tourId: string,
  fallbackRoute: string,
  userId?: string,
): Promise<{ route: string; errorMessage?: string }> {
  if (tourId !== "taskDetails") {
    return { route: fallbackRoute };
  }

  if (!userId) {
    return {
      route: "/tasks",
      errorMessage:
        "Faça login para abrir o guia de detalhes de uma tarefa.",
    };
  }

  try {
    const tasks = await getTasksDi().taskRepository.getTasks(userId);
    const next = getNextPendingTask(tasks);

    if (!next) {
      return {
        route: "/tasks",
        errorMessage:
          "Crie ou reabra uma tarefa pendente para iniciar este guia.",
      };
    }

    return { route: `/tasks/${next.id}` };
  } catch {
    return {
      route: "/tasks",
      errorMessage:
        "Não foi possível carregar suas tarefas para o guia. Tente novamente.",
    };
  }
}
