import * as React from "react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogPrimitive } from "@/components/ui/dialog";

import { Footer } from "./footer";
import { Header } from "./header";
import { IssueComposer } from "./issue-composer";

export const createIssueDialogHandle = DialogPrimitive.createHandle();

export function CreateIssueDialog() {
  const [expand, setExpand] = React.useState(false);
  return (
    <Dialog handle={createIssueDialogHandle}>
      <DialogContent
        flush
        style={
          {
            transition:
              "opacity 450ms var(--ease-out-expo), transform 450ms var(--ease-out-expo), scale 450ms var(--ease-out-expo), top 450ms var(--ease-out-expo), height 350ms var(--ease-in-out-quad), max-height 350ms var(--ease-in-out-quad), max-width 325ms var(--ease-in-out-quad), width 325ms var(--ease-in-out-quad)",
          } as React.CSSProperties
        }
        className={cn(
          "top-[16%] mt-6 flex -translate-y-[16%] flex-col overflow-hidden data-ending-style:top-[16%] data-starting-style:top-[16%]",
          expand
            ? "h-full max-h-[calc(100%-4rem)] sm:max-w-[820px]"
            : "h-[250px] sm:max-w-3xl"
        )}
        hideCloseIcon
      >
        <Header expand={expand} setExpand={setExpand} />
        <IssueComposer />
        <Footer />
      </DialogContent>
    </Dialog>
  );
}
