import * as React from "react";
import { issueLabelOptions } from "@/config";
import {
  ArrowExpand01Icon,
  ArrowShrink02Icon,
  Cancel01Icon,
  GreaterThanIcon,
  LabelIcon,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm, useStore } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { toast } from "sonner";
import * as z from "zod";

import { issueFilterOptions } from "@/config/team";
import {
  useIssueDrafts,
  useIssueDraftStore,
} from "@/hooks/use-issue-draft-store";
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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TooltipContent } from "@/components/ui/tooltip";
import { CopyButton } from "@/components/copy-button";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/editor/ui/editor";
import { ItemsCombobox } from "@/components/items-combobox";
import { useOrganization } from "@/components/organization-context";

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
  const { teams } = useOrganization();
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);
  const [expand, setExpand] = React.useState(false);
  const { organization } = useParams({ strict: false });
  const { drafts, saveDraft } = useIssueDrafts(organization);
  const triggerDraftId = useIssueDraftStore((state) => state.triggerDraftId);
  const setTriggerDraftId = useIssueDraftStore(
    (state) => state.setTriggerDraftId
  );

  const triggerDraft = React.useMemo(
    () => drafts.find((d) => d.id === triggerDraftId),
    [drafts, triggerDraftId]
  );
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
      title: triggerDraft?.title ?? "",
      description: editor.children,
      status: triggerDraft?.status ?? statusOptions[0].value,
      priority: triggerDraft?.priority ?? priorityOptions[0].value,
      labels: triggerDraft?.labels ?? ([] as Array<string>),
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
          <div className="relative">
            <CopyButton
              value={JSON.stringify(value, null, 2)}
              className="absolute top-3 right-3"
              variant="ghost"
            />
            <pre className="bg-sidebar pointer-events-auto mt-2 max-h-40 max-w-full overflow-auto rounded-md p-4">
              <code className="text-sidebar-foreground pointer-events-auto">
                {JSON.stringify(value, null, 2)}
              </code>
            </pre>
          </div>
        ),
        classNames: {
          content: "w-full",
        },
      });
    },
  });

  React.useEffect(() => {
    const isDefaultDescription =
      form.state.values.description?.length === 1 &&
      form.state.values.description[0].type === "p" &&
      form.state.values.description[0].children?.length === 1 &&
      form.state.values.description[0].children[0].text === "";

    if (dialogOpen && triggerDraft && isDefaultDescription) {
      editor.tf.withoutNormalizing(() => {
        editor.tf.insertNodes(triggerDraft.description, { at: [0] });
        editor.tf.removeNodes({ at: [triggerDraft.description.length] });
      });
    }
  }, [triggerDraft, dialogOpen, editor, form]);

  const isDirty = useStore(
    form.store,
    (state) =>
      state.values.title.length > 2 ||
      state.values.description?.some((node: any) =>
        node.children?.some((child: any) => child.text?.trim().length > 2)
      )
  );

  function handleOpenChange(open: boolean) {
    const hasTitle = form.state.values.title.trim().length > 0;
    const description = form.state.values.description;
    const isDefaultDescription =
      description?.length === 1 &&
      description[0].type === "p" &&
      description[0].children?.length === 1 &&
      description[0].children[0].text === "";
    const hasDescription = !isDefaultDescription;
    if (!triggerDraftId) {
      if (!open && (hasTitle || hasDescription)) {
        setConfirmationOpen(true);
      } else {
        setDialogOpen(open);
      }
    } else {
      if (!open && hasTitle && !isDefaultDescription) {
        saveDraft({
          id: triggerDraftId,
          title: form.state.values.title,
          description: form.state.values.description,
          status: form.state.values.status,
          priority: form.state.values.priority,
          labels: form.state.values.labels,
        });
      }
      setDialogOpen(open);
    }
  }

  function handleSaveDraft() {
    const draftId = Math.random().toString(36).substring(2, 9);
    saveDraft({
      id: draftId,
      title: form.state.values.title,
      description: form.state.values.description,
      status: form.state.values.status,
      priority: form.state.values.priority,
      labels: form.state.values.labels,
    });
    setDialogOpen(false);
    setConfirmationOpen(false);
    const id = toast.success("Issue draft saved", {
      action: (
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => {
            setDialogOpen(true);
            setTriggerDraftId(draftId);
            toast.dismiss(id);
          }}
        >
          Open draft
        </Button>
      ),
    });
  }

  return (
    <Dialog
      triggerId={triggerDraftId}
      handle={createIssueDialogHandle}
      open={dialogOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setExpand(false);
          form.reset();
          editor.tf.reset();
          setTriggerDraftId(null);
        }
      }}
      onOpenChange={handleOpenChange}
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
        <DialogHeader className="h-fit flex-row items-center justify-between px-3! pt-3! pb-1">
          <DialogTitle className="sr-only">Create Issue</DialogTitle>
          <div className="flex items-center gap-1.5">
            <Select
              disabled={teams.length <= 1}
              value={teams[0]}
              itemToStringLabel={(item) => item.name}
            >
              <SelectTrigger
                size="xs"
                hideIcon
                className="pl-1"
                tooltip={{
                  content: "Set team",
                  kbd: ["Ctrl", "⇧", "M"],
                }}
              >
                <div className="bg-muted shadow-border-sm size-4 rounded-sm p-0.5">
                  <HugeiconsIcon
                    icon={User02FreeIcons}
                    strokeWidth={2}
                    className="size-3"
                  />
                </div>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                align="start"
                className="w-44"
              >
                <SelectGroup>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team}>
                      <div className="bg-muted shadow-border-sm size-4 rounded-sm p-0.5">
                        <HugeiconsIcon
                          icon={User02FreeIcons}
                          strokeWidth={2}
                          className="size-3"
                        />
                      </div>
                      {team.name}
                      <span className="text-xs-plus text-muted-foreground leading-4 font-normal">
                        {team.slug}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <HugeiconsIcon
              icon={GreaterThanIcon}
              strokeWidth={2}
              className="size-2.5"
            />
            <span className="text-xs-plus leading-4 font-normal">
              New Issue
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {isDirty && !triggerDraftId && (
              <Button
                variant="outline"
                size="xs"
                tooltip={{
                  content: "Save draft",
                  kbd: ["Ctrl", "⇧", "S"],
                }}
                onClick={handleSaveDraft}
              >
                Save as draft
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setExpand(!expand)}
              tooltip={{
                content: expand ? "Collapse" : "Expand",
                kbd: ["Ctrl", "⇧", "F"],
              }}
            >
              <HugeiconsIcon
                icon={expand ? ArrowShrink02Icon : ArrowExpand01Icon}
                strokeWidth={2}
                className="size-3.5"
              />
              <span className="sr-only">Expand</span>
            </Button>
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  tooltip={{ content: "Close", kbd: ["Escape"] }}
                />
              }
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>
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
              <Button
                type="submit"
                form="create-issue-form"
                size="sm"
                className="px-4"
                disabled={isSubmitting}
                tooltip={
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
                }
              >
                Create issue
              </Button>
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
              <AlertDialogAction onClick={handleSaveDraft}>
                Save
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
