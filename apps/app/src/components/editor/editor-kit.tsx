import { type Value } from "platejs";
import { useEditorRef, type TPlateEditor } from "platejs/react";

import { BasicBlocksKit } from "./plugins/basic-blocks-kit";
import { BasicMarksKit } from "./plugins/basic-marks-kit";
import { BlockPlaceholderKit } from "./plugins/block-placeholder-kit";
import { CodeBlockKit } from "./plugins/code-block-kit";
import { FloatingToolbarKit } from "./plugins/floating-toolbar-kit";
import { ListKit } from "./plugins/list-kit";
import { SlashKit } from "./plugins/slash-kit";
import { ToggleKit } from "./plugins/toggle-kit";

export const EditorKit = [
  ...FloatingToolbarKit,
  ...BasicBlocksKit,
  ...BasicMarksKit,
  ...SlashKit,
  ...ToggleKit,
  ...ListKit,
  ...BlockPlaceholderKit,
  ...CodeBlockKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
