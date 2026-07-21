import { describe, expect, it } from "vitest";

import {
  NOTIFICATIONS_TOUR_STEP_TARGETS,
  notificationsTourSteps,
} from "@/presentation/tour/notificationsTourSteps";

describe("notificationsTourSteps", () => {
  it("define 2 passos cobrindo a tela de notificações", () => {
    expect(notificationsTourSteps).toHaveLength(2);
    expect(NOTIFICATIONS_TOUR_STEP_TARGETS).toHaveLength(2);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = notificationsTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='notifications-header']",
      "[data-tour='notifications-list']",
    ]);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of notificationsTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
