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
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./config";

export class FirebaseTaskRepository implements ITaskRepository {
  private collectionName = "tasks";

  async getTasks(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.mapDocumentToTask(doc));
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
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...task,
      createdAt: serverTimestamp(),
    });

    return {
      ...task,
      id: docRef.id,
      createdAt: new Date(),
    } as Task;
  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<Task> {
    const docRef = doc(db, this.collectionName, taskId);
    await updateDoc(docRef, { ...task });

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
    });

    const updated = await getDoc(docRef);
    return this.mapDocumentToTask(updated);
  }

  private mapDocumentToTask(doc: DocumentSnapshot): Task {
    const data = doc.data() ?? {};
    return {
      id: doc.id,
      userId: data["userId"] as string,
      title: data["title"] as string,
      description: data["description"] as string,
      steps: (data["steps"] as Task["steps"]) || [],
      status: data["status"] as TaskStatus,
      priority: data["priority"] as Task["priority"],
      category: data["category"] as Task["category"],
      dueDate: data["dueDate"]?.toDate(),
      completedAt: data["completedAt"]?.toDate(),
      createdAt: data["createdAt"]?.toDate() ?? new Date(),
    };
  }
}
