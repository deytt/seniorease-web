import { Task, TaskStatus } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
  deleteField,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./config";

function stripUndefined<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  return undefined;
}

export class FirebaseTaskRepository implements ITaskRepository {
  private collectionName = "tasks";

  async getTasks(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
    );
    const snapshot = await getDocs(q);
    return Promise.all(
      snapshot.docs.map((document) => this.mapDocumentToTask(document)),
    );
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    const docRef = doc(db, this.collectionName, taskId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return this.mapDocumentToTask(snapshot);
  }

  async createTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
    const taskData = stripUndefined({
      userId: task.userId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate
        ? Timestamp.fromDate(new Date(task.dueDate))
        : null,
      completedAt: task.completedAt
        ? Timestamp.fromDate(new Date(task.completedAt))
        : null,
      // Campo obrigatório para a Cloud Function `sendDueNotifications`
      notified: task.notified ?? false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const docRef = doc(collection(db, this.collectionName));
    const batch = writeBatch(db);
    batch.set(docRef, taskData);

    const createdSteps = task.steps.map((step, index) => {
      const stepRef = doc(collection(docRef, "steps"));
      batch.set(stepRef, {
        order: index + 1,
        title: step.title,
        instruction: step.instruction,
        isCompleted: step.isCompleted,
      });
      return {
        ...step,
        id: stepRef.id,
        taskId: docRef.id,
        order: index + 1,
      };
    });

    await batch.commit();

    return {
      ...task,
      id: docRef.id,
      steps: createdSteps,
      notified: task.notified ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<Task> {
    const docRef = doc(db, this.collectionName, taskId);
    const payload: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (task.title !== undefined) payload.title = task.title;
    if (task.description !== undefined) payload.description = task.description;
    if (task.status !== undefined) payload.status = task.status;
    if (task.priority !== undefined) payload.priority = task.priority;
    if (task.category !== undefined) payload.category = task.category;
    if (task.notified !== undefined) payload.notified = task.notified;
    if (task.completedAt !== undefined) {
      payload.completedAt = Timestamp.fromDate(new Date(task.completedAt));
    }
    if (task.dueDate !== undefined) {
      payload.dueDate = Timestamp.fromDate(new Date(task.dueDate));
      // Se o caller não setou notified, repõe para a CF poder reenviar
      if (task.notified === undefined) {
        payload.notified = false;
      }
    }

    if (task.steps !== undefined) {
      const batch = writeBatch(db);
      const currentSteps = await getDocs(collection(docRef, "steps"));
      const desiredStepIds = new Set(
        task.steps.map((step) => step.id).filter(Boolean),
      );
      currentSteps.docs.forEach((stepDocument) => {
        if (!desiredStepIds.has(stepDocument.id)) {
          batch.delete(stepDocument.ref);
        }
      });

      task.steps.forEach((step, index) => {
        const stepRef = step.id
          ? doc(collection(docRef, "steps"), step.id)
          : doc(collection(docRef, "steps"));
        batch.set(stepRef, {
          order: index + 1,
          title: step.title,
          instruction: step.instruction,
          isCompleted: step.isCompleted,
        });
      });

      // Remove o formato legado em array ao migrar uma tarefa existente.
      payload.steps = deleteField();
      batch.update(docRef, stripUndefined(payload));
      await batch.commit();
    } else {
      await updateDoc(docRef, stripUndefined(payload));
    }

    const updated = await getDoc(docRef);
    return this.mapDocumentToTask(updated);
  }

  async deleteTask(taskId: string): Promise<void> {
    const docRef = doc(db, this.collectionName, taskId);
    const steps = await getDocs(collection(docRef, "steps"));
    const batch = writeBatch(db);
    steps.docs.forEach((stepDocument) => batch.delete(stepDocument.ref));
    batch.delete(docRef);
    await batch.commit();
  }

  async completeTask(taskId: string): Promise<Task> {
    const docRef = doc(db, this.collectionName, taskId);
    const taskSnapshot = await getDoc(docRef);
    const legacySteps = (taskSnapshot.data()?.["steps"] as Task["steps"] | undefined) ?? [];
    const steps = await getDocs(collection(docRef, "steps"));
    const batch = writeBatch(db);
    if (steps.empty && legacySteps.length > 0) {
      legacySteps.forEach((step, index) => {
        const stepRef = doc(collection(docRef, "steps"));
        batch.set(stepRef, {
          order: index + 1,
          title: step.title,
          instruction: step.instruction,
          isCompleted: true,
        });
      });
    } else {
      steps.docs.forEach((stepDocument) =>
        batch.update(stepDocument.ref, { isCompleted: true }),
      );
    }
    batch.update(docRef, {
      status: "completed",
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...(legacySteps.length > 0 ? { steps: deleteField() } : {}),
    });
    await batch.commit();

    const updated = await getDoc(docRef);
    return this.mapDocumentToTask(updated);
  }

  private async getTaskSteps(
    taskId: string,
    legacySteps: Task["steps"] | undefined,
  ): Promise<Task["steps"]> {
    const stepsQuery = query(
      collection(db, this.collectionName, taskId, "steps"),
      orderBy("order", "asc"),
    );
    const snapshot = await getDocs(stepsQuery);

    if (snapshot.empty) {
      return legacySteps ?? [];
    }

    return snapshot.docs.map((stepDocument) => {
      const data = stepDocument.data();
      return {
        id: stepDocument.id,
        taskId,
        order: (data["order"] as number | undefined) ?? 0,
        title: (data["title"] as string | undefined) ?? "",
        instruction: (data["instruction"] as string | undefined) ?? "",
        isCompleted: (data["isCompleted"] as boolean | undefined) ?? false,
      };
    });
  }

  private async mapDocumentToTask(document: DocumentSnapshot): Promise<Task> {
    const data = document.data() ?? {};
    const steps = await this.getTaskSteps(
      document.id,
      data["steps"] as Task["steps"] | undefined,
    );
    return {
      id: document.id,
      userId: data["userId"] as string,
      title: data["title"] as string,
      description: data["description"] as string,
      steps,
      status: data["status"] as TaskStatus,
      priority: data["priority"] as Task["priority"],
      category: data["category"] as Task["category"],
      dueDate: toDate(data["dueDate"]),
      completedAt: toDate(data["completedAt"]),
      notified: (data["notified"] as boolean | undefined) ?? false,
      createdAt: toDate(data["createdAt"]) ?? new Date(),
      updatedAt: toDate(data["updatedAt"]),
    };
  }
}
