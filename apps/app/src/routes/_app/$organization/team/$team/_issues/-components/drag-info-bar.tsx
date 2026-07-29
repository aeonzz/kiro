import * as React from "react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/portal";

export const orderingLabels: Record<string, string> = {
  priority: "Priority",
  status: "Status",
  assignee: "Assignee",
  project: "Project",
  title: "Title",
  created: "Created date",
  updated: "Updated date",
};

export function DragInfoBar({
  open,
  ordering,
  grouping,
  container,
  isDraggingToOtherGroup = false,
  ctrlHeld = false,
  viewLabel = "List",
}: {
  open: boolean;
  ordering: string;
  grouping?: string;
  container: HTMLDivElement | null;
  isDraggingToOtherGroup?: boolean;
  ctrlHeld?: boolean;
  viewLabel?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleTransitionEnd = () => {
    if (!open) setMounted(false);
  };

  if (!mounted) return null;

  const orderingLabel = orderingLabels[ordering] ?? ordering;
  const isFieldOrdering = ordering === "priority";

  return (
    <Portal container={container}>
      <div
        onTransitionEnd={handleTransitionEnd}
        style={{ transition: "opacity 200ms ease, transform 200ms ease" }}
        className={cn(
          "bg-popover shadow-border pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex items-stretch rounded-md text-xs",
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
      >
        {ordering && (
          <div className="flex items-center px-3 py-2">
            <span className="text-muted-foreground whitespace-nowrap">
              {viewLabel} ordered by{" "}
              <span className="text-foreground font-medium">{orderingLabel}</span>
            </span>
          </div>
        )}
        {isDraggingToOtherGroup && ordering && (
          <div className="bg-border w-px my-2" />
        )}
        {isDraggingToOtherGroup && (
          <div className="flex flex-col justify-center gap-1.5 px-3 py-2">
            <span className="text-foreground font-medium leading-none">
              {ctrlHeld && isFieldOrdering ? "Drop to sort within this group" : "Drop to move to this group"}
            </span>
            {isFieldOrdering && (
              <span className="text-muted-foreground flex items-center gap-1 leading-none">
                {ctrlHeld ? (
                  <>
                    Release{" "}
                    <kbd className="bg-primary text-primary-foreground rounded px-1 py-px font-sans text-[10px] font-medium">
                      Ctrl
                    </kbd>{" "}
                    to just move to group
                  </>
                ) : (
                  <>
                    Hold{" "}
                    <kbd className="bg-muted text-muted-foreground rounded px-1 py-px font-sans text-[10px] font-medium">
                      Ctrl
                    </kbd>{" "}
                    to also change {orderingLabel}
                  </>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </Portal>
  );
}
