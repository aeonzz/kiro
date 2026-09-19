import { insertCallout } from "@platejs/callout";
import { insertCodeBlock, toggleCodeBlock } from "@platejs/code-block";
import { insertDate } from "@platejs/date";
import { insertExcalidraw } from "@platejs/excalidraw";
import { insertColumnGroup, toggleColumnGroup } from "@platejs/layout";
import { triggerFloatingLink } from "@platejs/link/react";
import { insertEquation, insertInlineEquation } from "@platejs/math";
import {
  insertAudioPlaceholder,
  insertFilePlaceholder,
  insertMedia,
  insertVideoPlaceholder,
} from "@platejs/media";
import { SuggestionPlugin } from "@platejs/suggestion/react";
import { TablePlugin } from "@platejs/table/react";
import { insertToc } from "@platejs/toc";
import { TogglePlugin } from "@platejs/toggle/react";
import {
  KEYS,
  PathApi,
  type NodeEntry,
  type Path,
  type TElement,
} from "platejs";
import type { PlateEditor } from "platejs/react";

import { getToggleHeading, setToggleTitleType } from "./utils/toggle";

const ACTION_THREE_COLUMNS = "action_three_columns";

// Plate reserves one indent level for a list's marker. Toggle enclosure uses
// the remaining depth, so changing block types must preserve that depth.
const getBlockIndent = (node: TElement) =>
  Math.max(0, Number(node.indent ?? 0) - (node[KEYS.listType] ? 1 : 0));

const preserveSelectedIndent = (editor: PlateEditor, indent: number) => {
  const entry = editor.api.block<TElement>({ highest: true });

  if (!entry || entry[1].length !== 1) return;

  const nextIndent = indent + (entry[0][KEYS.listType] ? 1 : 0);
  if (nextIndent > 0) {
    editor.tf.setNodes({ indent: nextIndent }, { at: entry[1] });
  } else {
    editor.tf.unsetNodes("indent", { at: entry[1] });
  }
};

const insertList = (editor: PlateEditor, type: string, indent: number) => {
  editor.tf.insertNodes(
    editor.api.create.block({
      indent: indent + 1,
      listStyleType: type,
    }),
    { select: true }
  );
};

const insertToggleContent = (editor: PlateEditor) => {
  const entry = editor.api.block<TElement>({ highest: true });

  if (!entry) return;

  const [node, path] = entry;

  if (node.type !== KEYS.toggle || path.length !== 1) return;

  editor.tf.insertNodes(
    editor.api.create.block({ indent: getBlockIndent(node) + 1 }),
    {
      at: PathApi.next(path),
      select: false,
    }
  );

  if (node.id) {
    editor.getApi(TogglePlugin).toggle.toggleIds([node.id as string], true);
  }
};

const insertParagraphAfterCodeBlock = (editor: PlateEditor) => {
  const entry = editor.api.block<TElement>({ highest: true });

  if (!entry) return;

  const [node, path] = entry;

  if (node.type !== KEYS.codeBlock) return;

  if (path.length !== 1 || path[0] !== editor.children.length - 1) return;

  const indent = getBlockIndent(node);
  editor.tf.insertNodes(editor.api.create.block(indent > 0 ? { indent } : {}), {
    at: PathApi.next(path),
    select: false,
  });
};

const insertBlockMap: Record<
  string,
  (editor: PlateEditor, type: string, indent: number) => void
> = {
  [KEYS.listTodo]: insertList,
  [KEYS.ol]: insertList,
  [KEYS.ul]: insertList,
  [ACTION_THREE_COLUMNS]: (editor) =>
    insertColumnGroup(editor, { columns: 3, select: true }),
  [KEYS.audio]: (editor) => insertAudioPlaceholder(editor, { select: true }),
  [KEYS.callout]: (editor) => insertCallout(editor, { select: true }),
  [KEYS.codeBlock]: (editor, _type, indent) => {
    insertCodeBlock(editor, { select: true });
    preserveSelectedIndent(editor, indent);
    insertParagraphAfterCodeBlock(editor);
  },
  [KEYS.equation]: (editor) => insertEquation(editor, { select: true }),
  [KEYS.excalidraw]: (editor) => insertExcalidraw(editor, {}, { select: true }),
  [KEYS.file]: (editor) => insertFilePlaceholder(editor, { select: true }),
  [KEYS.img]: (editor) =>
    insertMedia(editor, {
      select: true,
      type: KEYS.img,
    }),
  [KEYS.mediaEmbed]: (editor) =>
    insertMedia(editor, {
      select: true,
      type: KEYS.mediaEmbed,
    }),
  [KEYS.table]: (editor) =>
    editor.getTransforms(TablePlugin).insert.table({}, { select: true }),
  [KEYS.toggle]: (editor, type, indent) => {
    editor.tf.insertNodes(
      editor.api.create.block({ type, ...(indent > 0 ? { indent } : {}) }),
      { select: true }
    );
    insertToggleContent(editor);
  },
  [KEYS.toc]: (editor) => insertToc(editor, { select: true }),
  [KEYS.video]: (editor) => insertVideoPlaceholder(editor, { select: true }),
};

const insertInlineMap: Record<
  string,
  (editor: PlateEditor, type: string) => void
> = {
  [KEYS.date]: (editor) => insertDate(editor, { select: true }),
  [KEYS.inlineEquation]: (editor) =>
    insertInlineEquation(editor, "", { select: true }),
  [KEYS.link]: (editor) => triggerFloatingLink(editor, { focused: true }),
};

type InsertBlockOptions = {
  upsert?: boolean;
};

export const insertBlock = (
  editor: PlateEditor,
  type: string,
  options: InsertBlockOptions = {}
) => {
  const { upsert = false } = options;

  editor.tf.withoutNormalizing(() => {
    const block = editor.api.block<TElement>({ highest: true });

    if (!block) return;

    const [currentNode, path] = block;
    if (currentNode.type === KEYS.toggle) {
      setToggleTitleType(editor, type, block);
      return;
    }
    const isCurrentBlockEmpty = editor.api.isEmpty(currentNode);
    const currentBlockType = getBlockType(currentNode);

    const isSameBlockType = type === currentBlockType;
    const currentIndent = getBlockIndent(currentNode);

    // Keep newly added/converted blocks nested at the same level as the
    // block they were created from (e.g. content inside a collapsible
    // section), instead of always landing at the document's top level.
    const preserveIndent = () => {
      preserveSelectedIndent(editor, currentIndent);
    };

    if (upsert && isCurrentBlockEmpty) {
      if (isSameBlockType) return;

      if (type in setBlockMap || !(type in insertBlockMap)) {
        setBlockType(editor, type, { at: path });
        preserveIndent();
        return;
      }
    }

    if (type in insertBlockMap) {
      insertBlockMap[type](editor, type, currentIndent);
    } else {
      editor.tf.insertNodes(editor.api.create.block({ type }), {
        at: PathApi.next(path),
        select: true,
      });
    }

    preserveIndent();

    if (!isSameBlockType) {
      const removePreviousEmptyBlock = () => {
        editor.tf.removeNodes({ previousEmptyBlock: true });
      };
      const suggestion = editor.getApi(SuggestionPlugin).suggestion;

      if (suggestion) {
        suggestion.withoutSuggestions(removePreviousEmptyBlock);
      } else {
        removePreviousEmptyBlock();
      }
    }
  });
};

export const insertInlineElement = (editor: PlateEditor, type: string) => {
  if (insertInlineMap[type]) {
    insertInlineMap[type](editor, type);
  }
};

const setList = (
  editor: PlateEditor,
  type: string,
  entry: NodeEntry<TElement>
) => {
  editor.tf.setNodes(
    editor.api.create.block({
      indent: getBlockIndent(entry[0]) + 1,
      listStyleType: type,
    }),
    {
      at: entry[1],
    }
  );
};

const setBlockMap: Record<
  string,
  (editor: PlateEditor, type: string, entry: NodeEntry<TElement>) => void
> = {
  [KEYS.listTodo]: setList,
  [KEYS.ol]: setList,
  [KEYS.ul]: setList,
  [ACTION_THREE_COLUMNS]: (editor) => toggleColumnGroup(editor, { columns: 3 }),
  [KEYS.codeBlock]: (editor, _type, entry) => {
    toggleCodeBlock(editor);
    preserveSelectedIndent(editor, getBlockIndent(entry[0]));
    insertParagraphAfterCodeBlock(editor);
  },
  [KEYS.toggle]: (editor, type, entry) => {
    editor.tf.setNodes({ type }, { at: entry[1] });
    insertToggleContent(editor);
  },
};

export const setBlockType = (
  editor: PlateEditor,
  type: string,
  { at }: { at?: Path } = {}
) => {
  editor.tf.withoutNormalizing(() => {
    const setEntry = (entry: NodeEntry<TElement>) => {
      const [node, path] = entry;

      if (node.type === KEYS.toggle) {
        setToggleTitleType(editor, type, entry);
        return;
      }

      if (node[KEYS.listType]) {
        editor.tf.unsetNodes([KEYS.listType, "indent"], { at: path });
        const indent = getBlockIndent(node);
        if (indent > 0) editor.tf.setNodes({ indent }, { at: path });
      }
      if (type in setBlockMap) {
        return setBlockMap[type](editor, type, entry);
      }
      if (node.type !== type) {
        editor.tf.setNodes({ type }, { at: path });
      }
    };

    if (at) {
      const entry = editor.api.node<TElement>(at);

      if (entry) {
        setEntry(entry);

        return;
      }
    }

    const entries = editor.api.blocks({ mode: "lowest" });

    entries.forEach((entry) => {
      setEntry(entry);
    });
  });
};

export const getBlockType = (block: TElement) => {
  const heading = getToggleHeading(block);
  if (heading) return heading;

  if (block[KEYS.listType]) {
    if (block[KEYS.listType] === KEYS.ol) {
      return KEYS.ol;
    }
    if (block[KEYS.listType] === KEYS.listTodo) {
      return KEYS.listTodo;
    }
    return KEYS.ul;
  }

  return block.type;
};
