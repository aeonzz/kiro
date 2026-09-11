import { buildToggleIndex } from "@platejs/toggle/react";
import { KEYS, type TElement } from "platejs";
import { BlockPlaceholderPlugin } from "platejs/react";

import {
  getToggleHeading,
  isToggleContent,
  isToggleHeading,
} from "../utils/toggle";

export const BlockPlaceholderKit = [
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        "before:absolute before:cursor-text before:text-muted-foreground/60 before:content-[attr(placeholder)] text-sm-plus",
      placeholders: {
        [KEYS.p]: "Add description...",
        [KEYS.toggle]: "Add section title...",
        [KEYS.codeLine]: "Add code block content...",
      },
      query: ({ path }) => path.length === 1,
    },
  }).extendSelectors(({ editor, getOption }) => ({
    placeholder: (node: TElement) => {
      if (isToggleHeading(node.type) || getToggleHeading(node)) return;

      if (node.type === KEYS.toggle && editor.api.isEmpty(node)) {
        return "Add section title...";
      }

      if (isToggleContent(editor, node) && editor.api.isEmpty(node)) {
        const index = buildToggleIndex(editor.children);
        const toggleId = index.get(node.id as string)?.at(-1);

        // The prompt belongs to an empty body, not each blank line of spacing.
        if (
          toggleId &&
          !editor.children.some(
            (other) =>
              other.id !== node.id &&
              index.get(other.id as string)?.includes(toggleId)
          )
        ) {
          return "Add section content...";
        }

        return;
      }

      const target = getOption("_target");

      if (!target || target.node !== node) return;

      return target.placeholder;
    },
  })),
];
