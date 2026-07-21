import { describe, expect, it } from "vitest";

import {
  CREATE_TASK_TOUR_STEP_TARGETS,
  createTaskTourSteps,
} from "@/presentation/tour/createTaskTourSteps";

describe("createTaskTourSteps", () => {
  it("define 4 passos cobrindo o formulário de criação de tarefa", () => {
    expect(createTaskTourSteps).toHaveLength(4);
    expect(CREATE_TASK_TOUR_STEP_TARGETS).toHaveLength(4);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = createTaskTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='create-task-basics']",
      "[data-tour='create-task-meta']",
      "[data-tour='create-task-schedule']",
      "[data-tour='create-task-steps']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of createTaskTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
