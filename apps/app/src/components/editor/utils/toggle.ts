import { KEYS, type NodeEntry, type SlateEditor, type TElement } from "platejs";

export const isToggleHeading = (type: unknown): type is "h1" | "h2" | "h3" =>
  type === KEYS.h1 || type === KEYS.h2 || type === KEYS.h3;

export const getToggleHeading = (node: TElement) =>
  node.type === KEYS.toggle && isToggleHeading(node.toggleHeading)
    ? node.toggleHeading
    : undefined;

// A title stays a toggle: changing its node type would detach its content.
export const setToggleTitleType = (
  editor: SlateEditor,
  type: string,
  [node, path]: NodeEntry<TElement>
) => {
  if (node.type !== KEYS.toggle) return;

  if (isToggleHeading(type)) {
    editor.tf.setNodes({ toggleHeading: type }, { at: path });
  } else if (type === KEYS.p) {
    editor.tf.unsetNodes("toggleHeading", { at: path });
  }
};

const getIndent = (node: TElement) => Number(node.indent ?? 0);

export const isToggleContent = (editor: SlateEditor, node: TElement) => {
  if (node.type === KEYS.toggle || getIndent(node) === 0) return false;

  const path = editor.api.findPath(node);

  if (path?.length !== 1) return false;

  for (let index = path[0] - 1; index >= 0; index -= 1) {
    const sibling = editor.children[index] as TElement;

    if (sibling.type === KEYS.toggle) return true;
    if (getIndent(sibling) === 0) return false;
  }

  return false;
};
