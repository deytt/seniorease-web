"use client";

import { useEffect } from "react";

function applyScrollLockOverrides(locked: boolean) {
  if (locked) {
    document.body.style.setProperty("margin-right", "0", "important");
    document.body.style.setProperty("padding-right", "0", "important");
    document.body.style.setProperty("position", "static", "important");
    document.body.style.setProperty(
      "--removed-body-scroll-bar-size",
      "0px",
      "important",
    );
    document.documentElement.style.setProperty(
      "padding-right",
      "0",
      "important",
    );
  } else {
    document.body.style.removeProperty("margin-right");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("--removed-body-scroll-bar-size");
    document.documentElement.style.removeProperty("padding-right");
  }
}

/**
 * Radix Dialog (react-remove-scroll) injeta margin/padding-right no body ao
 * abrir modais. Neutralizamos isso inline com !important.
 *
 * Nota: não usamos scrollbar-gutter: stable no html — essa faixa reservada fica
 * fora da viewport de position:fixed e não pode receber o overlay do modal.
 */
export function ScrollLockFix() {
  useEffect(() => {
    const applyFix = () => {
      applyScrollLockOverrides(
        document.body.hasAttribute("data-scroll-locked"),
      );
    };

    applyFix();

    const observer = new MutationObserver(applyFix);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });
    observer.observe(document.head, { childList: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
