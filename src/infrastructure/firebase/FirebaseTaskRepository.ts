import { Task, TaskStatus } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
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
    return snapshot.docs.map((document) => this.mapDocumentToTask(document));
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
      steps: task.steps,
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

    const docRef = await addDoc(collection(db, this.collectionName), taskData);

    return {
      ...task,
      id: docRef.id,
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
    if (task.steps !== undefined) payload.steps = task.steps;
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

    await updateDoc(docRef, stripUndefined(payload));

    const updated = await getDoc(docRef);
    return this.mapDocumentToTask(updated);
  }

  async deleteTask(taskId: string): Promise<void> {
    const docRef = doc(db, this.collectionName, taskId);
    await deleteDoc(docRef);
  }

  async completeTask(taskId: string): Promise<Task> {
    const docRef = doc(db, this.collectionName, taskId);
    await updateDoc(docRef, {
      status: "completed",
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(docRef);
    return this.mapDocumentToTask(updated);
  }

  private mapDocumentToTask(document: DocumentSnapshot): Task {
    const data = document.data() ?? {};
    return {
      id: document.id,
      userId: data["userId"] as string,
      title: data["title"] as string,
      description: data["description"] as string,
      steps: (data["steps"] as Task["steps"]) || [],
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
