import { describe, expect, it } from "vitest";

import {
  ACCESSIBILITY_TOUR_STEP_TARGETS,
  accessibilityTourSteps,
} from "@/presentation/tour/accessibilityTourSteps";

describe("accessibilityTourSteps", () => {
  it("define passos com overview, seções e CTA de redefinir", () => {
    expect(accessibilityTourSteps).toHaveLength(6);
    expect(ACCESSIBILITY_TOUR_STEP_TARGETS).toHaveLength(6);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = accessibilityTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='a11y-header']",
      "[data-tour='a11y-font']",
      "[data-tour='a11y-mode']",
      "[data-tour='a11y-spacing']",
      "[data-tour='a11y-toggles']",
      "[data-tour='a11y-reset']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of accessibilityTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
