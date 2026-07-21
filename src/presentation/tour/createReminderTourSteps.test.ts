import { describe, expect, it } from "vitest";

import {
  CREATE_REMINDER_TOUR_STEP_TARGETS,
  createReminderTourSteps,
} from "@/presentation/tour/createReminderTourSteps";

describe("createReminderTourSteps", () => {
  it("define 4 passos cobrindo o formulário de criação de lembrete", () => {
    expect(createReminderTourSteps).toHaveLength(4);
    expect(CREATE_REMINDER_TOUR_STEP_TARGETS).toHaveLength(4);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = createReminderTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='create-reminder-basics']",
      "[data-tour='create-reminder-category']",
      "[data-tour='create-reminder-schedule']",
      "[data-tour='create-reminder-submit']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of createReminderTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
