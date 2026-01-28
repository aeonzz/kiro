import * as React from "react";
import {
  CheckListIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ListStyleType, someList, toggleList } from "@platejs/list";
import {
  useIndentTodoToolBarButton,
  useIndentTodoToolBarButtonState,
} from "@platejs/list/react";
import { useEditorRef, useEditorSelector } from "platejs/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ToolbarButton } from "./toolbar";

export const listItems = [
  {
    icon: <HugeiconsIcon icon={LeftToRightListBulletIcon} strokeWidth={2} />,
    label: "List",
    value: ListStyleType.Disc,
  },
  {
    icon: <HugeiconsIcon icon={LeftToRightListNumberIcon} strokeWidth={2} />,
    label: "Numbered List",
    value: ListStyleType.Decimal,
  },
  {
    icon: <HugeiconsIcon icon={CheckListIcon} strokeWidth={2} />,
    label: "Checklist",
    value: "todo",
  },
];

export function ListToolbarButton() {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const todoState = useIndentTodoToolBarButtonState({ nodeType: "todo" });
  const { props: todoProps } = useIndentTodoToolBarButton(todoState);

  const value = useEditorSelector(
    (editor) => {
      if (
        someList(editor, [
          ListStyleType.Disc,
          ListStyleType.Circle,
          ListStyleType.Square,
        ])
      ) {
        return ListStyleType.Disc;
      }

      if (
        someList(editor, [
          ListStyleType.Decimal,
          ListStyleType.LowerAlpha,
          ListStyleType.UpperAlpha,
          ListStyleType.LowerRoman,
          ListStyleType.UpperRoman,
        ])
      ) {
        return ListStyleType.Decimal;
      }

      if (todoState.pressed) {
        return "todo";
      }

      return null;
    },
    [todoState.pressed]
  );

  const selectedItem = React.useMemo(
    () => listItems.find((item) => item.value === value) ?? listItems[0],
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
        render={<ToolbarButton tooltip="List" isDropdown />}
      >
        {selectedItem.icon}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="ignore-click-outside/toolbar w-fit"
        align="start"
        alignOffset={-5}
        sideOffset={8}
      >
        <DropdownMenuRadioGroup
          value={value ?? ""}
          onValueChange={(v) => {
            if (v === "todo") {
              todoProps.onClick?.();
            } else {
              toggleList(editor, {
                listStyleType: v as ListStyleType,
              });
            }
          }}
        >
          {listItems.map(({ icon, label, value: itemValue }) => (
            <DropdownMenuRadioItem key={itemValue} value={itemValue}>
              {icon}
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
