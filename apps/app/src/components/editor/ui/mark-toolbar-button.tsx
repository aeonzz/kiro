import * as React from "react";
import { StrictOmit } from "@/types";
import { useMarkToolbarButton, useMarkToolbarButtonState } from "platejs/react";

import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MarkToolbarButton({
  clear,
  nodeType,
  ...props
}: StrictOmit<React.ComponentProps<typeof Toggle>, "size" | "variant"> & {
  nodeType: string;
  clear?: string[] | string;
  tooltip: string;
  kbd: string[];
}) {
  const state = useMarkToolbarButtonState({ clear, nodeType });
  const { props: buttonProps } = useMarkToolbarButton(state);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle size="sm" variant="secondary" {...buttonProps} {...props} />
        }
      />
      <TooltipContent className="space-x-2" side="top">
        <span>{props.tooltip}</span>
        <KbdGroup>
          {props.kbd.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}
