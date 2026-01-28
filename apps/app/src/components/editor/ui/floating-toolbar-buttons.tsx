import * as React from "react";
import {
  SourceCodeIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { KEYS } from "platejs";
import { useEditorReadOnly } from "platejs/react";

import { ListToolbarButton } from "./list-toolbar-button";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoToolbarButton } from "./turn-into-toolbar-button";

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <React.Fragment>
      {!readOnly && (
        <ToolbarGroup>
          <TurnIntoToolbarButton />
          <MarkToolbarButton
            nodeType={KEYS.bold}
            tooltip="Bold"
            kbd={["Ctrl", "B"]}
          >
            <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={KEYS.italic}
            tooltip="Italic"
            kbd={["Ctrl", "I"]}
          >
            <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={KEYS.strikethrough}
            tooltip="Strikethrough"
            kbd={["Ctrl", "S"]}
          >
            <HugeiconsIcon icon={TextStrikethroughIcon} strokeWidth={2} />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={KEYS.underline}
            tooltip="Underline"
            kbd={["Ctrl", "U"]}
          >
            <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={KEYS.code}
            tooltip="Inline code"
            kbd={["Ctrl", "E"]}
          >
            <HugeiconsIcon icon={SourceCodeIcon} strokeWidth={2} />
          </MarkToolbarButton>
          <ListToolbarButton />
        </ToolbarGroup>
      )}
    </React.Fragment>
  );
}
