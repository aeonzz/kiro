import * as React from "react";
import { ArrowRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { SlateElementProps } from "platejs/static";
import { SlateElement } from "platejs/static";

import { getToggleHeading } from "../utils/toggle";
import { toggleVariants } from "./toggle-node-variants";

export function ToggleElementStatic(props: SlateElementProps) {
  const heading = getToggleHeading(props.element);
  return (
    <SlateElement
      {...props}
      as={heading ?? "div"}
      className={toggleVariants({ heading })}
    >
      <div
        className="text-muted-foreground hover:bg-accent absolute top-1/2 -left-0.5 size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md p-px transition-colors select-none [&_svg]:size-4"
        contentEditable={false}
      >
        <HugeiconsIcon
          icon={ArrowRightIcon}
          className="rotate-0 transition-transform duration-75"
        />
      </div>
      {props.children}
    </SlateElement>
  );
}
