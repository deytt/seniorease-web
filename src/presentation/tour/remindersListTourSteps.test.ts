import { describe, expect, it } from "vitest";

import {
  REMINDERS_LIST_TOUR_STEP_TARGETS,
  remindersListTourSteps,
} from "@/presentation/tour/remindersListTourSteps";

describe("remindersListTourSteps", () => {
  it("define 4 passos cobrindo a central de lembretes", () => {
    expect(remindersListTourSteps).toHaveLength(4);
    expect(REMINDERS_LIST_TOUR_STEP_TARGETS).toHaveLength(4);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = remindersListTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='reminders-header']",
      "[data-tour='reminders-filter']",
      "[data-tour='reminders-create']",
      "[data-tour='reminders-list']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of remindersListTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
