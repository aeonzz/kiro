import { buildToggleIndex, TogglePlugin } from "@platejs/toggle/react";
import { ElementApi, KEYS, PathApi, type TElement } from "platejs";

import { ToggleElement } from "../ui/toggle-node";
import {
  getToggleHeading,
  isToggleContent,
  setToggleTitleType,
} from "../utils/toggle";
import { IndentKit } from "./indent-kit";

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement).overrideEditor(
    ({ editor, tf: { deleteBackward, insertBreak, toggleBlock } }) => ({
      transforms: {
        toggleBlock(type, options) {
          const entries = editor.api.blocks({
            at: options?.at,
            mode: "highest",
          });

          // Toggle's own Enter transform uses this command to split its title.
          if (
            type === KEYS.toggle ||
            !entries.some(([node]) => node.type === KEYS.toggle)
          ) {
            return toggleBlock(type, options);
          }

          editor.tf.withoutNormalizing(() => {
            for (const entry of entries) {
              if (entry[0].type === KEYS.toggle) {
                setToggleTitleType(
                  editor,
                  getToggleHeading(entry[0]) === type ? KEYS.p : type,
                  entry
                );
              } else {
                toggleBlock(type, { ...options, at: entry[1] });
              }
            }
          });
        },
        insertBreak() {
          const entry = editor.api.block<TElement>({ highest: true });

          if (
            editor.api.isCollapsed() &&
            entry?.[0].type === KEYS.toggle &&
            entry[1].length === 1 &&
            editor.api.isAt({ end: true }) &&
            editor.getOption(TogglePlugin, "isOpen", entry[0].id as string)
          ) {
            const contentPath = PathApi.next(entry[1]);
            const content = editor.api.node<TElement>(contentPath);

            if (
              content?.[0].type === KEYS.p &&
              !content[0][KEYS.listType] &&
              Number(content[0].indent ?? 0) > Number(entry[0].indent ?? 0) &&
              editor.api.isEmpty(content[0])
            ) {
              // Creation already supplied this paragraph; do not split off
              // another empty one and turn the initial prompt into spacing.
              editor.tf.select(editor.api.start(contentPath));
              return;
            }
          }

          // Never let a toggle title split via the default insertBreak (it
          // would duplicate into a second toggle) - just add a plain line
          // right after it (and after any content it already encloses)
          // instead, so the new line doesn't sever the title-to-content
          // adjacency that isToggleContent relies on.
          if (
            editor.api.isCollapsed() &&
            entry &&
            entry[0].type === KEYS.toggle &&
            entry[1].length === 1
          ) {
            const toggleId = entry[0].id as string;
            const index = buildToggleIndex(editor.children);
            let insertIndex = entry[1][0] + 1;

            for (let i = insertIndex; i < editor.children.length; i += 1) {
              const siblingId = editor.children[i].id as string | undefined;

              if (siblingId && index.get(siblingId)?.includes(toggleId)) {
                insertIndex = i + 1;
              } else {
                break;
              }
            }

            editor.tf.insertNodes(editor.api.create.block(), {
              at: [insertIndex],
              select: true,
            });
            return;
          }

          // Enter right after a trailing space inside toggle content exits
          // the toggle: the space is consumed and the newly split block is
          // outdented back to the toggle's own indent level.
          if (
            editor.api.isCollapsed() &&
            entry &&
            entry[1].length === 1 &&
            isToggleContent(editor, entry[0]) &&
            editor.selection
          ) {
            const before = editor.api.before(editor.selection, {
              unit: "character",
            });
            const charBefore =
              before &&
              editor.api.string({
                anchor: before,
                focus: editor.selection.anchor,
              });

            if (charBefore === " ") {
              const index = buildToggleIndex(editor.children);
              const toggleId = index.get(entry[0].id as string)?.at(-1);
              const toggle = toggleId
                ? editor.children.find((child) => child.id === toggleId)
                : undefined;

              editor.tf.withoutNormalizing(() => {
                editor.tf.delete({ unit: "character", reverse: true });
                insertBreak();

                const newEntry = editor.api.block<TElement>({
                  highest: true,
                });

                if (newEntry && newEntry[1].length === 1) {
                  const indent = Number(toggle?.indent ?? 0);

                  if (indent > 0) {
                    editor.tf.setNodes({ indent }, { at: newEntry[1] });
                  } else {
                    editor.tf.unsetNodes("indent", { at: newEntry[1] });
                  }
                }
              });

              return;
            }
          }

          if (
            !editor.api.isCollapsed() ||
            !entry ||
            entry[1].length !== 1 ||
            entry[1][0] === 0 ||
            entry[0].type !== KEYS.p ||
            entry[0][KEYS.listType] ||
            !editor.api.isEmpty(entry[0])
          ) {
            return insertBreak();
          }

          const [node, path] = entry;
          const index = buildToggleIndex(editor.children);
          const toggleId = index.get(node.id as string)?.at(-1);
          const previousPath = PathApi.previous(path);
          const previous =
            previousPath && editor.api.node<TElement>(previousPath);
          const next = editor.api.node<TElement>(PathApi.next(path));

          // Two consecutive empty paragraphs at the end of the same toggle:
          // keep the first as spacing, and move the current one outside.
          if (
            toggleId &&
            previous?.[0].type === KEYS.p &&
            !previous[0][KEYS.listType] &&
            editor.api.isEmpty(previous[0]) &&
            index.get(previous[0].id as string)?.at(-1) === toggleId &&
            (!next || !index.get(next[0].id as string)?.includes(toggleId))
          ) {
            const toggle = editor.children.find(
              (child) => child.id === toggleId
            );
            const indent = Number(toggle?.indent ?? 0);

            if (indent > 0) {
              editor.tf.setNodes({ indent }, { at: path });
            } else {
              editor.tf.unsetNodes("indent", { at: path });
            }
            return;
          }

          insertBreak();
        },
        deleteBackward(unit) {
          if (!editor.api.isCollapsed()) {
            deleteBackward(unit);
            return;
          }

          const entry = editor.api.block({ highest: true });

          if (
            entry &&
            isToggleContent(editor, entry[0]) &&
            editor.api.isEmpty(entry[0])
          ) {
            if (entry[0][KEYS.listType]) {
              // Remove the list marker before treating this as blank toggle
              // content. Only the marker's indent level should be removed.
              editor.tf.withoutNormalizing(() => {
                editor.tf.unsetNodes(
                  [
                    KEYS.listType,
                    KEYS.listChecked,
                    KEYS.listStart,
                    KEYS.listRestart,
                    KEYS.listRestartPolite,
                  ],
                  { at: entry[1] }
                );
                editor.tf.setNodes(
                  { indent: Number(entry[0].indent ?? 0) - 1 },
                  { at: entry[1] }
                );
              });
              return;
            }

            const titlePath = PathApi.previous(entry[1]);
            const titlePoint = titlePath && editor.api.end(titlePath);

            if (titlePoint) {
              editor.tf.select(titlePoint);
              return;
            }
          }

          if (
            entry &&
            entry[1].length === 1 &&
            entry[1][0] > 0 &&
            entry[0].type !== KEYS.toggle &&
            !isToggleContent(editor, entry[0]) &&
            editor.api.isAt({ start: true })
          ) {
            const previousPath = PathApi.previous(entry[1]);
            const previousEntry =
              previousPath && editor.api.node<TElement>(previousPath);

            if (
              previousPath &&
              previousEntry &&
              isToggleContent(editor, previousEntry[0]) &&
              editor.api.isEmpty(previousEntry[0])
            ) {
              const point = editor.api.end(previousPath);

              if (point) {
                editor.tf.select(point);
                return;
              }
            }
          }

          if (
            entry &&
            entry[0].type === KEYS.toggle &&
            entry[1].length === 1 &&
            entry[1][0] > 0 &&
            editor.api.isAt({ start: true })
          ) {
            const toggleId = entry[0].id as string;
            const togglePath = entry[1];
            // The plugin option is updated by a React effect and can be stale.
            const toggleIndex = buildToggleIndex(editor.children);

            editor.tf.withoutNormalizing(() => {
              // eslint-disable-next-line no-constant-condition
              while (true) {
                const nextPath = PathApi.next(togglePath);
                const nextEntry = editor.api.node<TElement>(nextPath);

                if (!nextEntry) break;

                const nextId = nextEntry[0].id as string | undefined;

                if (!nextId || !toggleIndex.get(nextId)?.includes(toggleId)) {
                  break;
                }

                editor.tf.removeNodes({ at: nextPath });
              }

              if (editor.api.isEmpty(entry[0])) {
                const previous = editor.api.previous<TElement>({
                  at: togglePath,
                  match: (node) =>
                    ElementApi.isElement(node) &&
                    editor.api.isBlock(node) &&
                    editor.api.isSelectable(node),
                });
                const point = previous && editor.api.end(previous[1]);

                if (point) {
                  // Slate's default merge removes an empty previous block,
                  // retaining the toggle. Delete the empty title explicitly.
                  editor.tf.removeNodes({ at: togglePath });
                  editor.tf.select(point);
                  return;
                }
              }

              deleteBackward(unit);
            });

            return;
          }

          deleteBackward(unit);
        },
      },
    })
  ),
];
