import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import {
  CheckListIcon,
  CodeSquareIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  QuoteDownIcon,
  UnfoldLessIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useComboboxInput,
  useHTMLInputCursorState,
} from "@platejs/combobox/react";
import { KEYS, type Point, type TComboboxInputElement } from "platejs";
import {
  PlateElement,
  useComposedRef,
  useEditorRef,
  type PlateElementProps,
} from "platejs/react";

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox";

import { insertBlock } from "../transforms";

type Group = {
  value: string;
  items: {
    icon: React.ReactNode;
    value: string;
    onSelect: (editor: any, value: string) => void;
    className?: string;
    focusEditor?: boolean;
    keywords?: string[];
    label?: string;
    shortcut?: string;
  }[];
};

const groups: Group[] = [
  {
    value: "Headings",
    items: [
      {
        icon: <HugeiconsIcon icon={Heading01Icon} strokeWidth={2} />,
        keywords: ["title", "h1"],
        label: "Heading 1",
        value: KEYS.h1,
        shortcut: "Ctrl ⇧ 1",
      },
      {
        icon: <HugeiconsIcon icon={Heading02Icon} strokeWidth={2} />,
        keywords: ["subtitle", "h2"],
        label: "Heading 2",
        value: KEYS.h2,
        shortcut: "Ctrl ⇧ 2",
      },
      {
        icon: <HugeiconsIcon icon={Heading03Icon} strokeWidth={2} />,
        keywords: ["subtitle", "h3"],
        label: "Heading 3",
        value: KEYS.h3,
        shortcut: "Ctrl ⇧ 3",
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value, { upsert: true });
      },
    })),
  },
  {
    value: "Lists",
    items: [
      {
        icon: (
          <HugeiconsIcon icon={LeftToRightListBulletIcon} strokeWidth={2} />
        ),
        keywords: ["unordered", "ul", "-"],
        label: "Bulleted list",
        value: KEYS.ul,
        shortcut: "Ctrl ⇧ 4",
      },
      {
        icon: (
          <HugeiconsIcon icon={LeftToRightListNumberIcon} strokeWidth={2} />
        ),
        keywords: ["ordered", "ol", "1"],
        label: "Numbered list",
        value: KEYS.ol,
        shortcut: "Ctrl ⇧ 5",
      },
      {
        icon: <HugeiconsIcon icon={CheckListIcon} strokeWidth={2} />,
        keywords: ["checklist", "task", "checkbox", "[]"],
        label: "Checklist",
        value: KEYS.listTodo,
        shortcut: "Ctrl ⇧ 6",
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value, { upsert: true });
      },
    })),
  },
  {
    value: "Advanced",
    items: [
      {
        icon: <HugeiconsIcon icon={CodeSquareIcon} strokeWidth={2} />,
        keywords: ["```"],
        label: "Code Block",
        value: KEYS.codeBlock,
        shortcut: "Ctrl ⇧ 7",
      },
      {
        icon: <HugeiconsIcon icon={UnfoldLessIcon} strokeWidth={2} />,
        keywords: ["collapsible", "expandable"],
        label: "Collapsible section",
        value: KEYS.toggle,
      },
      {
        icon: <HugeiconsIcon icon={QuoteDownIcon} strokeWidth={2} />,
        keywords: ["citation", "blockquote", "quote", ">"],
        label: "Blockquote",
        value: KEYS.blockquote,
        shortcut: "Alt ⇧ .",
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value, { upsert: true });
      },
    })),
  },
];

export function SlashInputElement(
  props: PlateElementProps<TComboboxInputElement>
) {
  const { editor, element } = props;

  const editorRef = useEditorRef();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cursorState = useHTMLInputCursorState(inputRef);

  const [value, setValue] = React.useState("");

  const isCreator = React.useMemo(() => {
    const elementUserId = (element as any).userId;
    const currentUserId = editor.meta.userId;

    if (!elementUserId) return true;

    return elementUserId === currentUserId;
  }, [editor.meta.userId, element]);

  const insertPoint = React.useRef<Point | null>(null);

  React.useEffect(() => {
    const path = editor.api.findPath(element);

    if (!path) return;

    const point = editor.api.before(path);

    if (!point) return;

    const pointRef = editor.api.pointRef(point);
    insertPoint.current = pointRef.current;

    return () => {
      pointRef.unref();
    };
  }, [editor, element]);

  const { props: inputProps, removeInput } = useComboboxInput({
    cancelInputOnBlur: true,
    cursorState,
    autoFocus: isCreator,
    ref: inputRef,
    onCancelInput: (cause) => {
      if (cause !== "backspace") {
        editor.tf.insertText("/" + value, {
          at: insertPoint?.current ?? undefined,
        });
      }
      if (cause === "arrowLeft" || cause === "arrowRight") {
        editor.tf.move({
          distance: 1,
          reverse: cause === "arrowLeft",
        });
      }
    },
  });

  const filteredGroups = React.useMemo(() => {
    const search = value.toLowerCase().trim();
    if (!search) return groups;

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          return (
            item.label?.toLowerCase().includes(search) ||
            item.value.toLowerCase().includes(search) ||
            item.keywords?.some((keyword) =>
              keyword.toLowerCase().includes(search)
            )
          );
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [value]);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(true);
  }, []);

  const ref = useComposedRef(inputRef, props.ref);

  return (
    <PlateElement {...props} as="span">
      <Combobox
        open={open}
        items={groups}
        filteredItems={filteredGroups}
        autoHighlight
      >
        <span>/</span>

        <span className="relative min-h-lh">
          <span
            className="invisible overflow-hidden text-nowrap"
            aria-hidden="true"
          >
            {value || "\u200B"}
          </span>

          <ComboboxPrimitive.Input
            ref={ref}
            className="absolute top-0 left-0 size-full bg-transparent outline-none"
            value={value}
            {...inputProps}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </span>

        <ComboboxContent
          anchor={inputRef}
          align="start"
          sideOffset={6}
          className="w-56"
        >
          <ComboboxEmpty>No results</ComboboxEmpty>
          <ComboboxList className="max-h-(--available-height)!">
            {(group: Group, index) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxCollection>
                  {(item) => (
                    <ComboboxItem
                      key={item.value}
                      value={item.value}
                      onClick={() => {
                        removeInput(item.focusEditor ?? true);
                        item.onSelect(editorRef, item.value);
                      }}
                      className="pr-2.5"
                    >
                      {item.icon}
                      {item.label ?? item.value}
                      <span className="text-muted-foreground ml-auto text-xs">
                        {item.shortcut}
                      </span>
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
                {index < filteredGroups.length - 1 && <ComboboxSeparator />}
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {props.children}
    </PlateElement>
  );
}
