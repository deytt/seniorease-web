import { describe, expect, it, vi, beforeEach } from "vitest";
import { resolveTourRoute } from "@/presentation/tour/resolveTourRoute";

vi.mock("@/lib/di/tasksDi", () => ({
  getTasksDi: vi.fn(),
}));

import { getTasksDi } from "@/lib/di/tasksDi";

const mockedGetTasksDi = vi.mocked(getTasksDi);

describe("resolveTourRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devolve a rota fallback para tours estáticos", async () => {
    await expect(resolveTourRoute("dashboard", "/dashboard", "u1")).resolves.toEqual({
      route: "/dashboard",
    });
  });

  it("resolve taskDetails para a próxima tarefa pendente", async () => {
    mockedGetTasksDi.mockReturnValue({
      taskRepository: {
        getTasks: vi.fn().mockResolvedValue([
          {
            id: "t-next",
            userId: "u1",
            title: "Próxima",
            status: "pending",
            dueDate: new Date("2099-01-01T10:00:00"),
            priority: "medium",
            category: "health",
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      },
    } as never);

    await expect(
      resolveTourRoute("taskDetails", "/tasks", "u1"),
    ).resolves.toEqual({ route: "/tasks/t-next" });
  });

  it("informa quando não há tarefa pendente para taskDetails", async () => {
    mockedGetTasksDi.mockReturnValue({
      taskRepository: {
        getTasks: vi.fn().mockResolvedValue([]),
      },
    } as never);

    const result = await resolveTourRoute("taskDetails", "/tasks", "u1");
    expect(result.route).toBe("/tasks");
    expect(result.errorMessage).toMatch(/tarefa pendente/i);
  });
});
