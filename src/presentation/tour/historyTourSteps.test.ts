import { describe, expect, it } from "vitest";

import {
  HISTORY_TOUR_STEP_TARGETS,
  historyTourSteps,
} from "@/presentation/tour/historyTourSteps";

describe("historyTourSteps", () => {
  it("define 3 passos cobrindo as seções do histórico", () => {
    expect(historyTourSteps).toHaveLength(3);
    expect(HISTORY_TOUR_STEP_TARGETS).toHaveLength(3);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = historyTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='history-header']",
      "[data-tour='history-stats']",
      "[data-tour='history-activity']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of historyTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
