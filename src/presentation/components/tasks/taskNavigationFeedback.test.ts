import { beforeEach, describe, expect, it } from "vitest";

import {
  consumeTaskNavigationFeedback,
  setTaskNavigationFeedback,
} from "./taskNavigationFeedback";

describe("taskNavigationFeedback", () => {
  beforeEach(() => window.sessionStorage.clear());

  it.each(["created", "deleted"] as const)(
    "transporta o feedback %s até a tela de listagem uma única vez",
    (feedback) => {
      setTaskNavigationFeedback(feedback);

      expect(consumeTaskNavigationFeedback()).toBe(feedback);
      expect(consumeTaskNavigationFeedback()).toBeNull();
    },
  );
});
