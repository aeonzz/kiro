import { type Value } from "platejs";
import { useEditorRef, type TPlateEditor } from "platejs/react";

import { BasicBlocksKit } from "./plugins/basic-blocks-kit";
import { BasicMarksKit } from "./plugins/basic-marks-kit";
import { BlockPlaceholderKit } from "./plugins/block-placeholder-kit";
import { BlockSelectionKit } from "./plugins/block-selection-kit";
import { CodeBlockKit } from "./plugins/code-block-kit";
import { DndKit } from "./plugins/dnd-kit";
import { FloatingToolbarKit } from "./plugins/floating-toolbar-kit";
import { ListKit } from "./plugins/list-kit";
import { SlashKit } from "./plugins/slash-kit";
import { ToggleKit } from "./plugins/toggle-kit";

export const EditorKit = [
  ...FloatingToolbarKit,
  ...BasicBlocksKit,
  ...BasicMarksKit,
  ...SlashKit,
  // Before DndKit: the drag handle calls into the block selection API.
  ...BlockSelectionKit,
  ...DndKit,
  ...ToggleKit,
  ...ListKit,
  ...BlockPlaceholderKit,
  ...CodeBlockKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
