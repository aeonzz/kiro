import * as React from "react";
import {
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { TElement } from "platejs";
import { KEYS } from "platejs";
import { useEditorRef, useSelectionFragmentProp } from "platejs/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getBlockType, setBlockType } from "@/components/editor/transforms";

import { ToolbarButton } from "./toolbar";

export const turnIntoItems = [
  {
    icon: TextFontIcon,
    keywords: ["paragraph"],
    label: "Text",
    value: KEYS.p,
  },
  {
    icon: Heading01Icon,
    keywords: ["title", "h1"],
    label: "Heading 1",
    value: "h1",
  },
  {
    icon: Heading02Icon,
    keywords: ["subtitle", "h2"],
    label: "Heading 2",
    value: "h2",
  },
  {
    icon: Heading03Icon,
    keywords: ["subtitle", "h3"],
    label: "Heading 3",
    value: "h3",
  },
];

export function TurnIntoToolbarButton() {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const value = useSelectionFragmentProp({
    defaultValue: KEYS.p,
    getProp: (node) => getBlockType(node as TElement),
  });
  const selectedItem = React.useMemo(
    () =>
      turnIntoItems.find((item) => item.value === (value ?? KEYS.p)) ??
      turnIntoItems[0],
    [value]
  );

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      modal={false}
      onOpenChangeComplete={() => {
        editor.tf.focus();
      }}
    >
      <DropdownMenuTrigger
        render={<ToolbarButton tooltip="Turn into" isDropdown />}
      >
        <HugeiconsIcon icon={selectedItem.icon} strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="ignore-click-outside/toolbar w-fit"
        align="start"
        alignOffset={-5}
        sideOffset={8}
      >
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(type) => {
            setBlockType(editor, type);
          }}
        >
          {turnIntoItems.map(({ icon, label, value: itemValue }) => (
            <DropdownMenuRadioItem key={itemValue} value={itemValue}>
              <HugeiconsIcon icon={icon} strokeWidth={2} />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
