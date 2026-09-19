import { IndentPlugin } from "@platejs/indent/react";
import { KEYS } from "platejs";

export const IndentKit = [
  IndentPlugin.configure({
    inject: {
      targetPlugins: [
        ...KEYS.heading,
        KEYS.p,
        KEYS.blockquote,
        KEYS.codeBlock,
        KEYS.toggle,
        KEYS.img,
        KEYS.list,
      ],
    },
    options: {
      offset: 24,
    },
  }).overrideEditor(() => ({
    transforms: {
      // Swallow Tab/Shift+Tab entirely: no indenting, and no moving focus
      // out of the editor to the next focusable element.
      tab: () => true,
    },
  })),
];
