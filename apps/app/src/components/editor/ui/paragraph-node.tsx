import type { PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";

import { cn } from "@/lib/utils";

export function isListItemParagraph(element: unknown) {
  return Boolean((element as { listStyleType?: string })?.listStyleType);
}

export function ParagraphElement(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className={cn(
        "slate-selectable m-0 px-0",
        isListItemParagraph(props.element) ? "py-1" : "py-2"
      )}
    >
      {props.children}
    </PlateElement>
  );
}
