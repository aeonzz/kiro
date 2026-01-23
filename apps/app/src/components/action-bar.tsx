import * as React from "react";
import { useRender } from "@base-ui/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

import { Portal } from "./portal";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface ActionBarContextValue {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ActionBarContext = React.createContext<ActionBarContextValue | undefined>(
  undefined
);

function useActionBar() {
  const context = React.useContext(ActionBarContext);
  if (!context) {
    throw new Error("useActionBar must be used within an ActionBar");
  }
  return context;
}

function usePresence(open: boolean) {
  const [state, setState] = React.useState<
    "hidden" | "starting" | "open" | "ending"
  >(open ? "open" : "hidden");

  React.useLayoutEffect(() => {
    if (open) {
      setState("starting");
      const raf = requestAnimationFrame(() => {
        setState("open");
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setState("ending");
    }
  }, [open]);

  const handleAnimationEnd = React.useCallback(() => {
    if (!open) {
      setState("hidden");
    }
  }, [open]);

  return {
    state,
    isMounted: state !== "hidden",
    handleAnimationEnd,
  };
}

interface ActionBarProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ActionBar({
  children,
  open = false,
  onOpenChange,
}: ActionBarProps) {
  return (
    <ActionBarContext.Provider value={{ open, onOpenChange }}>
      {children}
    </ActionBarContext.Provider>
  );
}

export function ActionBarPortal({
  ...props
}: useRender.ComponentProps<typeof Portal>) {
  return <Portal {...props} />;
}

export function ActionBarContent({
  className,
  container,
  onAnimationEnd,
  onTransitionEnd,
  ...props
}: React.ComponentProps<"div"> &
  Pick<React.ComponentProps<typeof Portal>, "container">) {
  const { open } = useActionBar();
  const { state, isMounted, handleAnimationEnd } = usePresence(open);

  if (!isMounted) {
    return null;
  }

  return (
    <ActionBarPortal container={container}>
      <div
        role="toolbar"
        data-state={open ? "open" : "closed"}
        data-starting-style={state === "starting" ? "" : undefined}
        data-open={state === "open" ? "" : undefined}
        data-ending-style={state === "ending" ? "" : undefined}
        onAnimationEnd={(e) => {
          handleAnimationEnd();
          onAnimationEnd?.(e);
        }}
        onTransitionEnd={(e) => {
          handleAnimationEnd();
          onTransitionEnd?.(e);
        }}
        className={cn(
          "bg-popover shadow-border absolute bottom-6 left-1/2 flex w-fit -translate-x-1/2 items-center gap-2 rounded-md p-2",
          "ease-out-expo transition-all duration-450",
          "data-starting-style:translate-y-2 data-starting-style:opacity-0",
          "data-open:translate-y-0 data-open:opacity-100",
          "data-ending-style:translate-y-2 data-ending-style:opacity-0",
          className
        )}
        {...props}
      />
    </ActionBarPortal>
  );
}

export function ActionBarClose({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { onOpenChange } = useActionBar();

  return (
    <Button
      variant="ghostPopup"
      size="icon-sm"
      className={cn("shrink-0", className)}
      onClick={(e) => {
        onOpenChange?.(false);
        onClick?.(e);
      }}
      {...props}
    >
      <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
      <span className="sr-only">Close</span>
    </Button>
  );
}

export function ActionBarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      orientation="vertical"
      className={cn("my-0.5", className)}
      {...props}
    />
  );
}
