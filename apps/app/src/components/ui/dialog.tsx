import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "ease-out-expo fixed inset-0 isolate bg-black/60 duration-450 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function DialogViewport({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Viewport>) {
  return (
    <DialogPrimitive.Viewport
      data-slot="dialog-viewport"
      className={cn(
        "fixed inset-0 flex items-center justify-center overflow-hidden p-4",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  hideCloseIcon = false,
  flush = false,
  ...props
}: DialogPrimitive.Popup.Props & {
  hideCloseIcon?: boolean;
  flush?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogViewport>
        <DialogPrimitive.Popup
          data-flush={flush}
          data-slot="dialog-content"
          className={cn(
            "group/dialog-content bg-background shadow-border-md ease-out-expo fixed left-1/2 grid max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-[30%] rounded-lg text-sm transition-all duration-450 outline-none sm:max-w-sm",
            "top-[calc(30%+1rem*var(--nested-dialogs))] scale-[calc(1-0.05*var(--nested-dialogs))] data-ending-style:top-[30%] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:top-[30%] data-starting-style:scale-95 data-starting-style:opacity-0",
            flush ? "gap-0 p-0" : "gap-4 p-4",
            className
          )}
          {...props}
        >
          {children}
          {!hideCloseIcon && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2"
                  size="icon-sm"
                />
              }
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </DialogViewport>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2 group-data-[flush=true]/dialog-content:px-4 group-data-[flush=true]/dialog-content:pt-4",
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "border-t-border flex flex-col-reverse gap-2 rounded-b-lg p-4 group-data-[flush=true]/dialog-content:border-t sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogViewport,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogPrimitive,
};
