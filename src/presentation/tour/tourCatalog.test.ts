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
    expect(getTourCatalogItem("inexistente")).toBeUndefined();
  });
});
