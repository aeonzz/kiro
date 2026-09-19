import type { SlateElementProps } from "platejs/static";
import { SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";

import { isListItemParagraph } from "./paragraph-node";

export function ParagraphElementStatic(props: SlateElementProps) {
  return (
    <SlateElement
      {...props}
      className={cn(
        "m-0 px-0",
        isListItemParagraph(props.element) ? "py-1" : "py-2"
      )}
    >
      {props.children}
    </SlateElement>
  );
}
