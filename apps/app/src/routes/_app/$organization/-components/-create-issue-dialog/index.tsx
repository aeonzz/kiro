import * as React from "react";
import { issueLabelOptions } from "@/config";
import { LabelIcon } from "@hugeicons/core-free-icons";
import { useForm, useStore } from "@tanstack/react-form";
import { motion } from "motion/react";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { toast } from "sonner";
import * as z from "zod";

import { issueFilterOptions } from "@/config/team";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogPrimitive,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/editor/ui/editor";
import { ItemsCombobox } from "@/components/items-combobox";

import { Header } from "./header";

const formSchema = z.object({
  title: z.string().max(512),
  status: z.string(),
  priority: z.string(),
  labels: z.array(z.string()),
  description: z.custom<Value>(),
});

export const createIssueDialogHandle = DialogPrimitive.createHandle();

const MotionPopup = motion.create(DialogPrimitive.Popup);

export function CreateIssueDialog() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);
  const [expand, setExpand] = React.useState(false);
  const statusOptions =
    issueFilterOptions.find((option) => option.id === "status")?.options ?? [];

  const priorityOptions =
    issueFilterOptions.find((option) => option.id === "priority")?.options ??
    [];

  const editor = usePlateEditor({
    plugins: EditorKit,
  });

  const height = expand ? "100%" : "auto";
  const width = expand ? "820px" : "768px";

  const form = useForm({
    defaultValues: {
      title: "",
      description: editor.children,
      status: statusOptions[0].value,
      priority: priorityOptions[0].value,
      labels: [] as Array<string>,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.title) {
        toast.info("Title required", {
          description: "Please enter a title before submitting",
        });
        return;
      }

      toast("Issue created", {
        description: (
          <pre className="bg-sidebar mt-2 max-h-40 max-w-full overflow-auto rounded-md p-4">
            <code className="text-sidebar-foreground">
              {JSON.stringify(value, null, 2)}
            </code>
          </pre>
        ),
        classNames: {
          content: "w-full",
        },
      });
    },
  });

  const isDirty = useStore(
    form.store,
    (state) =>
      state.values.title.length > 2 ||
      state.values.description?.some((node: any) =>
        node.children?.some((child: any) => child.text?.trim().length > 2)
      )
  );

  return (
    <Dialog
      handle={createIssueDialogHandle}
      open={dialogOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setExpand(false);
          form.reset();
          editor.tf.reset();
        }
      }}
      onOpenChange={(open) => {
        const hasTitle = form.state.values.title.trim().length > 0;
        const hasDescription = form.state.values.description?.some(
          (node: any) =>
            node.children?.some((child: any) => child.text?.trim().length > 0)
        );

        if (!open && (hasTitle || hasDescription)) {
          setConfirmationOpen(true);
        } else {
          setDialogOpen(open);
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
        <Header expand={expand} setExpand={setExpand} isDirty={isDirty} />
        <form
          id="create-issue-form"
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex min-h-32 flex-1 flex-col gap-1 overflow-hidden px-3">
            <form.Field
              name="title"
              children={(field) => {
                return (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="placeholder:text-muted-foreground/60 min-h-0 shrink-0 px-1 pb-0 text-lg! font-semibold shadow-none focus-visible:ring-0"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Issue title"
                    maxLength={512}
                    autoFocus
                  />
                );
              }}
            />
            <form.Field
              name="description"
              children={(field) => (
                <Plate
                  editor={editor}
                  onChange={({ value }) => field.handleChange(value)}
                >
                  <EditorContainer className="min-h-0 flex-1 overflow-y-auto">
                    <Editor
                      variant="textarea"
                      placeholder="Add description..."
                    />
                  </EditorContainer>
                </Plate>
              )}
            />
          </div>
          <div className="flex items-center gap-2 p-3">
            <form.Field
              name="status"
              children={(field) => (
                <ItemsCombobox
                  id={field.name}
                  name={field.name}
                  items={statusOptions}
                  value={statusOptions.find(
                    (option) => option.value === field.state.value
                  )}
                  onValueChange={(value) =>
                    field.handleChange(value?.value || statusOptions[0].value)
                  }
                  placeholder="Change status..."
                  tooltipContent="Change status"
                  kbd="S"
                />
              )}
            />
            <form.Field
              name="priority"
              children={(field) => (
                <ItemsCombobox
                  id={field.name}
                  name={field.name}
                  items={priorityOptions}
                  value={priorityOptions.find(
                    (option) => option.value === field.state.value
                  )}
                  onValueChange={(value) =>
                    field.handleChange(value?.value || priorityOptions[0].value)
                  }
                  placeholder="Set priority to..."
                  tooltipContent="Set priority"
                  kbd="P"
                />
              )}
            />
            <form.Field
              name="labels"
              children={(field) => (
                <ItemsCombobox
                  id={field.name}
                  name={field.name}
                  items={issueLabelOptions}
                  value={issueLabelOptions.filter((option) =>
                    field.state.value.includes(option.value)
                  )}
                  onValueChange={(value) =>
                    field.handleChange(value.map((v) => v.value))
                  }
                  multiple
                  placeholder="Add labels..."
                  tooltipContent="Set labels"
                  kbd="L"
                  label="Labels"
                  icon={LabelIcon}
                />
              )}
            />
          </div>
        </form>
        <DialogFooter className="mt-auto p-3.5">
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="submit"
                      form="create-issue-form"
                      size="sm"
                      className="px-4"
                      disabled={isSubmitting}
                    />
                  }
                >
                  <span>Create issue</span>
                </TooltipTrigger>
                <TooltipContent
                  className="flex flex-col gap-1.5"
                  collisionAvoidance={{
                    side: "flip",
                  }}
                >
                  <div className="space-x-2">
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>Enter</Kbd>
                    </KbdGroup>
                    <span>to save issue</span>
                  </div>
                  <div className="space-x-2">
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>Alt</Kbd>
                      <Kbd>Enter</Kbd>
                    </KbdGroup>
                    <span>to save and open issue</span>
                  </div>
                  <div className="space-x-2">
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>⇧</Kbd>
                      <Kbd>Enter</Kbd>
                    </KbdGroup>
                    <span>to save and draft new</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          />
        </DialogFooter>
      </DialogContent>
      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save to drafts?</AlertDialogTitle>
            <AlertDialogDescription>
              You can finish this issue later from your drafts
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-between">
            <AlertDialogAction
              variant="outline"
              onClick={() => {
                setConfirmationOpen(false);
                setDialogOpen(false);
              }}
            >
              Discard
            </AlertDialogAction>
            <div className="flex gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Save</AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
