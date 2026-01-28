import * as React from "react";
import { motion } from "motion/react";

import { Dialog, DialogContent, DialogPrimitive } from "@/components/ui/dialog";
import { IssueComposer } from "@/components/editor/ui/issue-composer";

import { Footer } from "./footer";
import { Header } from "./header";
import { IssueProperties } from "./issue-properties";

export const createIssueDialogHandle = DialogPrimitive.createHandle();

const MotionPopup = motion.create(DialogPrimitive.Popup);

export function CreateIssueDialog() {
  const [expand, setExpand] = React.useState(false);

  const height = expand ? "100%" : "auto";
  const width = expand ? "820px" : "768px";

  return (
    <Dialog
      handle={createIssueDialogHandle}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setExpand(false);
        }
      }}
    >
      <DialogContent
        flush
        style={
          {
            transition:
              "opacity 450ms var(--ease-out-expo), transform 450ms var(--ease-out-expo), scale 450ms var(--ease-out-expo), top 450ms var(--ease-out-expo), height, width",
          } as React.CSSProperties
        }
        className="top-[16%] mt-6 flex max-h-[calc(100%-4rem)] min-w-3xl -translate-y-[16%] flex-col overflow-hidden data-ending-style:top-[16%] data-starting-style:top-[16%] sm:max-w-none"
        render={
          <MotionPopup
            initial={{ height, width }}
            animate={{
              height,
              width,
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        }
        hideCloseIcon
      >
        <Header expand={expand} setExpand={setExpand} />
        <IssueComposer />
        <IssueProperties />
        <Footer />
      </DialogContent>
    </Dialog>
  );
}
