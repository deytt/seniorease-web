import { describe, expect, it } from "vitest";

import {
  TASKS_LIST_TOUR_STEP_TARGETS,
  tasksListTourSteps,
} from "@/presentation/tour/tasksListTourSteps";

describe("tasksListTourSteps", () => {
  it("define 4 passos cobrindo a lista de tarefas", () => {
    expect(tasksListTourSteps).toHaveLength(4);
    expect(TASKS_LIST_TOUR_STEP_TARGETS).toHaveLength(4);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = tasksListTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='tasks-header']",
      "[data-tour='tasks-search']",
      "[data-tour='tasks-filter']",
      "[data-tour='tasks-list']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of tasksListTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
