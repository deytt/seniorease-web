export interface TaskStep {
  id: string;
  taskId: string;
  order: number;
  title: string;
  instruction: string;
  isCompleted: boolean;
}
