import { ArrowRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useToggleButton, useToggleButtonState } from "@platejs/toggle/react";
import type { PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";

import { Button } from "@/components/ui/button";

export function ToggleElement(props: PlateElementProps) {
  const element = props.element;
  const state = useToggleButtonState(element.id as string);
  const { buttonProps, open } = useToggleButton(state);

  return (
    <PlateElement {...props} className="relative h-6.5 pl-6">
      <Button
        size="icon-xs"
        variant="ghost"
        className="absolute top-px -left-0.5 size-5"
        contentEditable={false}
        {...buttonProps}
      >
        <HugeiconsIcon
          icon={ArrowRightIcon}
          className={
            open
              ? "rotate-90 transition-transform duration-75"
              : "rotate-0 transition-transform duration-75"
          }
        />
      </Button>
      {props.children}
    </PlateElement>
  );
}
