import type { Decorator } from "@storybook/react";

/** Replica a largura e os espaçamentos do conteúdo do shell autenticado. */
export const AppContentDecorator: Decorator = (Story) => (
  <main className="min-w-0 bg-background">
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
      <Story />
    </div>
  </main>
);
