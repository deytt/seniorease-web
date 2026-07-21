import { describe, expect, it } from "vitest";

import {
  PROFILE_TOUR_STEP_TARGETS,
  profileTourSteps,
} from "@/presentation/tour/profileTourSteps";

describe("profileTourSteps", () => {
  it("define 8 passos cobrindo todas as seções do perfil", () => {
    expect(profileTourSteps).toHaveLength(8);
    expect(PROFILE_TOUR_STEP_TARGETS).toHaveLength(8);
  });

  it("aponta para os data-tour corretos em ordem de leitura", () => {
    const selectors = profileTourSteps.map((step) => step.element);

    expect(selectors).toEqual([
      "[data-tour='profile-header']",
      "[data-tour='profile-photo']",
      "[data-tour='profile-account-status']",
      "[data-tour='profile-help']",
      "[data-tour='profile-personal-info']",
      "[data-tour='profile-address']",
      "[data-tour='profile-notifications']",
      "[data-tour='profile-account-support']",
    ]);
  });

  it("menciona o Guia do aplicativo no passo de Conta e suporte", () => {
    const supportStep = profileTourSteps.find(
      (step) => step.element === "[data-tour='profile-account-support']",
    );
    expect(supportStep?.popover?.description).toMatch(/Guia do aplicativo/i);
  });

  it("define título e descrição em português simples para cada passo", () => {
    for (const step of profileTourSteps) {
      expect(step.popover?.title?.trim()).toBeTruthy();
      expect(step.popover?.description?.trim()).toBeTruthy();
    }
  });
});
