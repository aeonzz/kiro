import * as React from "react";
import type { StrictOmit } from "@/types";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/editor/ui/editor";

const initialValue: Value = [
  {
    children: [{ text: "Title" }],
    type: "h3",
  },
  {
    children: [{ text: "This is a quote." }],
    type: "blockquote",
  },
  {
    children: [
      { text: "With some " },
      { bold: true, text: "bold" },
      { text: " text for emphasis!" },
    ],
    type: "p",
  },
  {
    type: "p",
    children: [
      { text: "Hello! Try out the " },
      { text: "bold", bold: true },
      { text: ", " },
      { text: "italic", italic: true },
      { text: ", and " },
      { text: "underline", underline: true },
      { text: " formatting." },
    ],
  },
];

interface IssueComposerProps extends StrictOmit<
  React.ComponentProps<"div">,
  "children"
> {}

export function IssueComposer({ className, ...props }: IssueComposerProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    // value: initialValue,
  });

  return (
    <div
      className={cn(
        "flex min-h-32 flex-1 flex-col gap-1 overflow-hidden px-3",
        className
      )}
      {...props}
    >
      <Textarea
        className="placeholder:text-muted-foreground/60 min-h-0 shrink-0 px-1 pb-0 text-lg! font-semibold shadow-none focus-visible:ring-0"
        autoComplete="off"
        autoCorrect="off"
        placeholder="Issue title"
        maxLength={512}
        autoFocus
      />
      <Plate editor={editor}>
        <EditorContainer className="min-h-0 flex-1 overflow-y-auto">
          <Editor variant="textarea" placeholder="Add description..." />
        </EditorContainer>
      </Plate>
    </div>
  );
}
