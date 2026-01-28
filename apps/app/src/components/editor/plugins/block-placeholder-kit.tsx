import { KEYS } from "platejs";
import { BlockPlaceholderPlugin } from "platejs/react";

export const BlockPlaceholderKit = [
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        "before:absolute before:cursor-text before:text-muted-foreground/60 before:content-[attr(placeholder)] text-sm-plus",
      placeholders: {
        [KEYS.p]: "Add description...",
        [KEYS.toggle]: "Add section content...",
        [KEYS.codeLine]: "Add code block content...",
      },
      query: ({ path }) => path.length === 1,
    },
  }),
];
