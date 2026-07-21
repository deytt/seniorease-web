import { describe, expect, it } from "vitest";

import {
  TASK_DETAILS_TOUR_STEP_TARGETS,
  taskDetailsTourSteps,
} from "@/presentation/tour/taskDetailsTourSteps";

describe("taskDetailsTourSteps", () => {
  it("define 3 passos cobrindo os detalhes da tarefa", () => {
    expect(taskDetailsTourSteps).toHaveLength(3);
    expect(TASK_DETAILS_TOUR_STEP_TARGETS).toHaveLength(3);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = taskDetailsTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='task-details-header']",
      "[data-tour='task-details-steps']",
      "[data-tour='task-details-actions']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of taskDetailsTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
