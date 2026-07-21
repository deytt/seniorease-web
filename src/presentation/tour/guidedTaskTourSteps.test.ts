import { describe, expect, it } from "vitest";

import {
  GUIDED_TASK_TOUR_STEP_TARGETS,
  guidedTaskTourSteps,
} from "@/presentation/tour/guidedTaskTourSteps";

describe("guidedTaskTourSteps", () => {
  it("define passos com overview, conteúdo e CTA de navegação", () => {
    expect(guidedTaskTourSteps).toHaveLength(5);
    expect(GUIDED_TASK_TOUR_STEP_TARGETS).toHaveLength(5);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = guidedTaskTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='guided-header']",
      "[data-tour='guided-progress']",
      "[data-tour='guided-step-card']",
      "[data-tour='guided-tip']",
      "[data-tour='guided-nav']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of guidedTaskTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
