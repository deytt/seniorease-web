import type { Preview } from "storybook";
import { ThemeProvider } from "next-themes";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    actions: {},

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      toc: true,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="p-8 bg-white">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
