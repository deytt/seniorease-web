import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCollection,
  mockDoc,
  mockGetDocs,
  mockGetDoc,
  mockSetDoc,
  mockUpdateDoc,
  mockDeleteDoc,
  mockQuery,
  mockWhere,
  mockServerTimestamp,
  mockTimestampFromDate,
} = vi.hoisted(() => ({
  mockCollection: vi.fn(),
  mockDoc: vi.fn(),
  mockGetDocs: vi.fn(),
  mockGetDoc: vi.fn(),
  mockSetDoc: vi.fn(),
  mockUpdateDoc: vi.fn(),
  mockDeleteDoc: vi.fn(),
  mockQuery: vi.fn(),
  mockWhere: vi.fn(),
  mockServerTimestamp: vi.fn(() => "SERVER_TIMESTAMP"),
  mockTimestampFromDate: vi.fn((date: Date) => ({
    toDate: () => date,
    __type: "Timestamp",
    date,
  })),
}));

vi.mock("@/infrastructure/firebase/config", () => ({
  db: { __isMockDb: true },
}));

vi.mock("firebase/firestore", () => ({
  collection: mockCollection,
  doc: mockDoc,
  getDocs: mockGetDocs,
  getDoc: mockGetDoc,
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  query: mockQuery,
  where: mockWhere,
  serverTimestamp: mockServerTimestamp,
  Timestamp: {
    fromDate: mockTimestampFromDate,
  },
}));

import { FirebaseTaskRepository } from "@/infrastructure/firebase/FirebaseTaskRepository";

function buildDocSnapshot(
  id: string,
  data: Record<string, unknown> | undefined,
) {
  return {
    id,
    exists: () => data !== undefined,
    data: () => data,
  };
}

describe("FirebaseTaskRepository", () => {
  const repository = new FirebaseTaskRepository();
  const collectionRef = { path: "tasks" };
  const queryRef = { __query: true };
  const docRef = { id: "task-1", path: "tasks/task-1" };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCollection.mockReturnValue(collectionRef);
    mockQuery.mockReturnValue(queryRef);
    mockWhere.mockReturnValue({ __where: true });
    mockDoc.mockReturnValue(docRef);
    mockSetDoc.mockResolvedValue(undefined);
    mockUpdateDoc.mockResolvedValue(undefined);
    mockDeleteDoc.mockResolvedValue(undefined);
  });

  it("getTasks() retorna array de Task mapeado corretamente", async () => {
    const dueDate = new Date("2026-07-27T08:00:00");
    const createdAt = new Date("2026-07-26T09:00:00");

    mockGetDocs.mockResolvedValue({
      docs: [
        buildDocSnapshot("task-1", {
          userId: "user-1",
          title: "Tomar remédio",
          description: "Após o café",
          status: "pending",
          priority: "high",
          category: "medication",
          notified: false,
          dueDate: { toDate: () => dueDate },
          createdAt: { toDate: () => createdAt },
          steps: [
            {
              id: "step_0",
              taskId: "task-1",
              order: 0,
              title: "Abrir o frasco",
              instruction: "Com cuidado",
              isCompleted: false,
            },
          ],
        }),
      ],
    });

    const tasks = await repository.getTasks("user-1");

    expect(mockWhere).toHaveBeenCalledWith("userId", "==", "user-1");
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual(
      expect.objectContaining({
        id: "task-1",
        userId: "user-1",
        title: "Tomar remédio",
        description: "Após o café",
        status: "pending",
        priority: "high",
        category: "medication",
        notified: false,
        dueDate,
        createdAt,
        steps: [
          {
            id: "step_0",
            taskId: "task-1",
            order: 0,
            title: "Abrir o frasco",
            instruction: "Com cuidado",
            isCompleted: false,
          },
        ],
      }),
    );
  });

  it("create() chama setDoc com os campos corretos (incluindo steps como array)", async () => {
    const dueDate = new Date("2026-07-27T08:00:00");
    mockDoc.mockReturnValue({ id: "new-task", path: "tasks/new-task" });

    const result = await repository.createTask({
      userId: "user-1",
      title: "Caminhada",
      description: "30 minutos",
      status: "pending",
      priority: "medium",
      category: "exercise",
      dueDate,
      notified: false,
      steps: [
        {
          id: "temp",
          taskId: "temp",
          order: 0,
          title: "Colocar ténis",
          instruction: "",
          isCompleted: false,
        },
      ],
    });

    expect(mockSetDoc).toHaveBeenCalledWith(
      { id: "new-task", path: "tasks/new-task" },
      expect.objectContaining({
        userId: "user-1",
        title: "Caminhada",
        description: "30 minutos",
        status: "pending",
        priority: "medium",
        category: "exercise",
        notified: false,
        createdAt: "SERVER_TIMESTAMP",
        updatedAt: "SERVER_TIMESTAMP",
        steps: [
          {
            id: "step_0",
            taskId: "new-task",
            order: 0,
            title: "Colocar ténis",
            instruction: "",
            isCompleted: false,
          },
        ],
      }),
    );
    expect(mockTimestampFromDate).toHaveBeenCalledWith(expect.any(Date));
    expect(result.id).toBe("new-task");
    expect(result.steps[0]?.taskId).toBe("new-task");
  });

  it("complete() atualiza status, steps e completedAt", async () => {
    mockGetDoc
      .mockResolvedValueOnce(
        buildDocSnapshot("task-1", {
          userId: "user-1",
          title: "Tomar remédio",
          description: "",
          status: "pending",
          notified: false,
          createdAt: { toDate: () => new Date("2026-07-26T09:00:00") },
          steps: [
            {
              id: "step_0",
              taskId: "task-1",
              order: 0,
              title: "Abrir",
              instruction: "",
              isCompleted: false,
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        buildDocSnapshot("task-1", {
          userId: "user-1",
          title: "Tomar remédio",
          description: "",
          status: "completed",
          notified: false,
          completedAt: { toDate: () => new Date("2026-07-26T11:00:00") },
          createdAt: { toDate: () => new Date("2026-07-26T09:00:00") },
          steps: [
            {
              id: "step_0",
              taskId: "task-1",
              order: 0,
              title: "Abrir",
              instruction: "",
              isCompleted: true,
            },
          ],
        }),
      );

    const result = await repository.completeTask("task-1");

    expect(mockUpdateDoc).toHaveBeenCalledWith(docRef, {
      status: "completed",
      steps: [
        {
          id: "step_0",
          taskId: "task-1",
          order: 0,
          title: "Abrir",
          instruction: "",
          isCompleted: true,
        },
      ],
      completedAt: "SERVER_TIMESTAMP",
      updatedAt: "SERVER_TIMESTAMP",
    });
    expect(result.status).toBe("completed");
    expect(result.steps[0]?.isCompleted).toBe(true);
  });

  it("delete() chama deleteDoc com o ID correto", async () => {
    await repository.deleteTask("task-1");

    expect(mockDoc).toHaveBeenCalledWith(
      { __isMockDb: true },
      "tasks",
      "task-1",
    );
    expect(mockDeleteDoc).toHaveBeenCalledWith(docRef);
  });

  it("getTaskById() retorna null quando documento não existe", async () => {
    mockGetDoc.mockResolvedValue(buildDocSnapshot("missing", undefined));

    const result = await repository.getTaskById("missing");

    expect(result).toBeNull();
  });

  it("getTaskById() retorna Task quando documento existe", async () => {
    mockGetDoc.mockResolvedValue(
      buildDocSnapshot("task-1", {
        userId: "user-1",
        title: "Tomar remédio",
        description: "Após o café",
        status: "pending",
        notified: true,
        createdAt: { toDate: () => new Date("2026-07-26T09:00:00") },
        steps: [],
      }),
    );

    const result = await repository.getTaskById("task-1");

    expect(result).toEqual(
      expect.objectContaining({
        id: "task-1",
        title: "Tomar remédio",
        notified: true,
        steps: [],
      }),
    );
  });
});
