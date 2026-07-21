import { describe, expect, it } from "vitest";

import {
  DASHBOARD_TOUR_STEP_TARGETS,
  dashboardTourSteps,
} from "@/presentation/tour/dashboardTourSteps";

describe("dashboardTourSteps", () => {
  it("define 4 passos cobrindo as seções do painel", () => {
    expect(dashboardTourSteps).toHaveLength(4);
    expect(DASHBOARD_TOUR_STEP_TARGETS).toHaveLength(4);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = dashboardTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='dashboard-header']",
      "[data-tour='dashboard-today-tasks']",
      "[data-tour='dashboard-quick-actions']",
      "[data-tour='dashboard-reminders']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of dashboardTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
