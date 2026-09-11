import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from "@platejs/code-block/react";
import { all, createLowlight } from "lowlight";
import { KEYS, type SlateEditor, type TElement } from "platejs";

import {
  CodeBlockElement,
  CodeLineElement,
  CodeSyntaxLeaf,
} from "../ui/code-block-node";

const lowlight = createLowlight(all);

const getCodeBlockBeforeLastEmptyBlock = (editor: SlateEditor) => {
  if (!editor.selection || !editor.api.isCollapsed()) return null;

  const entry = editor.api.block<TElement>({ highest: true });

  if (!entry) return null;

  const [node, path] = entry;

  if (path.length !== 1 || path[0] === 0) return null;
  if (path[0] !== editor.children.length - 1) return null;
  if (node.type !== KEYS.p || !editor.api.isEmpty(node)) return null;

  const previous = editor.children[path[0] - 1] as TElement | undefined;

  if (previous?.type !== KEYS.codeBlock) return null;

  return [path[0] - 1];
};

const getLastEmptyBlockAfterCodeBlock = (editor: SlateEditor) => {
  if (!editor.selection || !editor.api.isCollapsed()) return null;

  const entry = editor.api.block<TElement>({ highest: true });

  if (!entry) return null;

  const [node, path] = entry;

  if (path.length !== 1 || node.type !== KEYS.codeBlock) return null;

  const nextIndex = path[0] + 1;

  if (nextIndex !== editor.children.length - 1) return null;

  const next = editor.children[nextIndex] as TElement | undefined;

  if (next?.type !== KEYS.p || !editor.api.isEmpty(next)) return null;
  if (!editor.api.isEnd(editor.selection.anchor, path)) return null;

  return [nextIndex];
};

export const CodeBlockKit = [
  CodeBlockPlugin.configure({
    node: { component: CodeBlockElement },
    options: { lowlight },
    shortcuts: { toggle: { keys: "mod+shift+7" } },
  }).overrideEditor(({ editor, tf: { deleteBackward, deleteForward } }) => ({
    transforms: {
      deleteBackward(unit) {
        const codeBlockPath = getCodeBlockBeforeLastEmptyBlock(editor);

        if (codeBlockPath) {
          const point = editor.api.end(codeBlockPath);

          if (point) {
            editor.tf.select(point);

            return;
          }
        }

        deleteBackward(unit);
      },
      deleteForward(unit) {
        const emptyBlockPath = getLastEmptyBlockAfterCodeBlock(editor);

        if (emptyBlockPath) {
          const point = editor.api.start(emptyBlockPath);

          if (point) {
            editor.tf.select(point);

            return;
          }
        }

        deleteForward(unit);
      },
    },
  })),
  CodeLinePlugin.withComponent(CodeLineElement),
  CodeSyntaxPlugin.withComponent(CodeSyntaxLeaf),
];
