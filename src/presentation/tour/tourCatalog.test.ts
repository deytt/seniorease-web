import { describe, expect, it } from "vitest";
import { TOUR_CATALOG, getTourCatalogItem } from "@/presentation/tour/tourCatalog";

describe("tourCatalog", () => {
  it("tem ids únicos", () => {
    const ids = TOUR_CATALOG.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("encontra item por id", () => {
    expect(getTourCatalogItem("profile")?.route).toBe("/profile");
    expect(getTourCatalogItem("history")?.route).toBe("/history");
    expect(getTourCatalogItem("dashboard")?.route).toBe("/dashboard");
    expect(getTourCatalogItem("tasksList")?.route).toBe("/tasks");
    expect(getTourCatalogItem("createTask")?.route).toBe("/tasks/create");
    expect(getTourCatalogItem("taskDetails")?.route).toBe("/tasks");
    expect(getTourCatalogItem("remindersList")?.route).toBe("/reminders");
    expect(getTourCatalogItem("createReminder")?.route).toBe(
      "/reminders/create",
    );
    expect(getTourCatalogItem("guidedTask")?.route).toBe("/tasks/guided");
    expect(getTourCatalogItem("notifications")?.route).toBe("/notifications");
    expect(getTourCatalogItem("accessibility")?.route).toBe("/accessibility");
    expect(getTourCatalogItem("inexistente")).toBeUndefined();
  });

  it("define título e descrição em português simples para cada item", () => {
    for (const item of TOUR_CATALOG) {
      expect(item.title.trim()).toBeTruthy();
      expect(item.description.trim()).toBeTruthy();
      expect(item.route.startsWith("/")).toBe(true);
    }
  });
});
