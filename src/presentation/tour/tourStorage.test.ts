import { beforeEach, describe, expect, it } from "vitest";

import {
  markTourCompleted,
  markTourOffered,
  wasTourCompleted,
  wasTourOffered,
} from "@/presentation/tour/tourStorage";

describe("tourStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("marca e consulta oferta do tour por usuário", () => {
    expect(wasTourOffered("user-1", "profile")).toBe(false);

    markTourOffered("user-1", "profile");

    expect(wasTourOffered("user-1", "profile")).toBe(true);
    expect(wasTourOffered("user-2", "profile")).toBe(false);
  });

  it("marca e consulta conclusão do tour por usuário", () => {
    expect(wasTourCompleted("user-1", "profile")).toBe(false);

    markTourCompleted("user-1", "profile");

    expect(wasTourCompleted("user-1", "profile")).toBe(true);
    expect(wasTourCompleted("user-2", "profile")).toBe(false);
  });
});
