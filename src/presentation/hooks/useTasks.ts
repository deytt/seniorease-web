import { useState, useCallback } from "react";
import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export function useTasks(taskRepository: ITaskRepository) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await taskRepository.getTasks(userId);
        setTasks(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar tarefas",
        );
      } finally {
        setLoading(false);
      }
    },
    [taskRepository],
  );

  const fetchTaskById = useCallback(
    async (taskId: string): Promise<Task | null> => {
      try {
        return await taskRepository.getTaskById(taskId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar tarefa",
        );
        return null;
      }
    },
    [taskRepository],
  );

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    fetchTaskById,
  };
}
