import * as React from "react";
import {
  getWorkflowIcon,
  workflowGroupOrder,
  type WorkflowGroupType,
} from "@/config";
import { DotIcon } from "@/components/icons";
import { useTeamLabels } from "@/hooks/use-team-labels";
import { useTeamWorkflowStates } from "@/hooks/use-team-workflow-states";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { toast } from "sonner";
import * as z from "zod";

import { IssuePriority } from "@/types/enums";
import { issueFilterOptions } from "@/config/team";
import { issueDraftQueries, organizationQueries } from "@/lib/query-factory";
import { getIssuesPowerSyncCollection } from "@/lib/collections/issues-powersync";
import { createIssueSchema } from "@/services/issue/schema";
import { deleteIssueDraftFn } from "@/services/issue/server-fn";
import { useIssueDraftStore } from "@/hooks/use-issue-draft-store";
import { useAuthenticatedSession } from "@/hooks/use-session";
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
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/editor/ui/editor";
import { ItemsCombobox, MultiItemsCombobox } from "@/components/items-combobox";
import { useOrganization } from "@/components/organization-context";

const formSchema = z.object({
  title: z.string().max(512),
  status: z.string(),
  priority: z.enum(IssuePriority),
  labels: z.array(z.string()),
  description: z.custom<Value>(),
  projectId: z.string().nullable(),
  teamId: z.string(),
});

export const createIssueDialogHandle = DialogPrimitive.createHandle();

const MotionPopup = motion.create(DialogPrimitive.Popup);

const workflowTypeOrder = new Map(
  workflowGroupOrder.map((type, index) => [type, index])
);

function getSelectableWorkflowStates<
  T extends { position: number; type: WorkflowGroupType },
>(workflowStates?: T[]) {
  return [...(workflowStates ?? [])]
    .filter((state) => state.type !== "DUPLICATE")
    .sort(
      (a, b) =>
        (workflowTypeOrder.get(a.type) ?? Number.MAX_SAFE_INTEGER) -
          (workflowTypeOrder.get(b.type) ?? Number.MAX_SAFE_INTEGER) ||
        a.position - b.position
    );
}

function getDefaultWorkflowStateId<
  T extends {
    id: string;
    isDefault: boolean;
    position: number;
    type: WorkflowGroupType;
  },
>(workflowStates?: T[]) {
  const workflowStatesByPosition = getSelectableWorkflowStates(workflowStates);

  return (
    workflowStatesByPosition.find((state) => state.isDefault)?.id ??
    workflowStatesByPosition[0]?.id ??
    ""
  );
}

function getNextIssueNumber(issues: Array<{ number?: number | null }>) {
  return issues.reduce((max, issue) => Math.max(max, issue.number ?? 0), 0) + 1;
}

export function CreateIssueDialog() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const qc = useQueryClient();
  const { user } = useAuthenticatedSession();
  const { activeOrganization, isPending } = useOrganization();
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);
  const [expand, setExpand] = React.useState(false);
  const triggerDraftId = useIssueDraftStore((state) => state.triggerDraftId);
  const setTriggerDraftId = useIssueDraftStore(
    (state) => state.setTriggerDraftId
  );
  const drafts = activeOrganization?.issueDrafts ?? [];

  const triggerDraft = React.useMemo(
    () => drafts.find((d) => d.id === triggerDraftId),
    [drafts, triggerDraftId]
  );

  const parsedDescription = React.useMemo(() => {
    if (!triggerDraft?.description) return null;
    try {
      return JSON.parse(triggerDraft.description) as Value;
    } catch {
      return null;
    }
  }, [triggerDraft]);

  const priorityOptions =
    issueFilterOptions.find((option) => option.id === "priority")?.options ??
    [];

  const editor = usePlateEditor({
    plugins: EditorKit,
  });

  const height = expand ? "100%" : "auto";
  const width = expand ? "820px" : "768px";

  const saveDraftMutation = useMutation({
    ...issueDraftQueries.mutations.save(),
  });

  const form = useForm({
    defaultValues: {
      title: triggerDraft?.title ?? "",
      description: parsedDescription ?? editor.children,
      status:
        triggerDraft?.status ??
        getDefaultWorkflowStateId(activeOrganization?.teams[0]?.workflowStates),
      priority: triggerDraft?.priority ?? priorityOptions[0].value,
      labels: (triggerDraft?.labels as string[]) ?? ([] as Array<string>),
      teamId: triggerDraft?.teamId ?? activeOrganization?.teams[0]?.id ?? "",
      projectId: triggerDraft?.projectId ?? null,
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

      if (!activeOrganization) {
        toast.error("Organization unavailable");
        return;
      }

      const submittedTeam = activeOrganization.teams.find(
        (t) => t.id === value.teamId
      );

      if (!submittedTeam) {
        toast.error("Team unavailable");
        return;
      }

      // Generate the id client-side so the optimistic row and the server row
      // share a key (flicker-free insert).
      const id = crypto.randomUUID();
      const data = createIssueSchema.parse({
        id,
        draftId: triggerDraftId ?? undefined,
        organizationId: activeOrganization.id,
        title: value.title,
        description: value.description,
        status: value.status,
        priority: value.priority,
        labels: value.labels,
        teamId: value.teamId,
        projectId: value.projectId,
      });

      const issuesCollection = getIssuesPowerSyncCollection();
      const now = new Date().toISOString();

      // Insert the raw issue row into local SQLite. PowerSync applies it
      // optimistically and uploads it to Postgres via the connector's
      // uploadData -> uploadCrudFn (PUT) path. Labels aren't an issue column
      // (m2m, not synced yet), so labels-on-create don't persist for now.
      issuesCollection.insert({
        id: data.id,
        number: getNextIssueNumber(issuesCollection.toArray),
        title: data.title,
        description: JSON.stringify(data.description),
        priority: data.priority,
        teamId: data.teamId,
        creatorId: user.id,
        assigneeId: null,
        stateId: data.status,
        parentId: null,
        projectId: data.projectId ?? null,
        cycleId: null,
        createdAt: now,
        updatedAt: now,
      });

      // The issue row can't carry draftId, so delete the source draft directly.
      if (triggerDraftId) {
        void deleteIssueDraftFn({ data: { draftId: triggerDraftId } });
      }

      toast.success("Issue created");
      setDialogOpen(false);
      qc.invalidateQueries({ queryKey: issueDraftQueries.all() });
      qc.invalidateQueries({ queryKey: organizationQueries.all() });
    },
  });

  const selectedTeamId = useStore(form.store, (state) => state.values.teamId);
  const selectedTeam = React.useMemo(
    () =>
      activeOrganization?.teams.find((t) => t.id === selectedTeamId) ??
      activeOrganization?.teams[0],
    [activeOrganization, selectedTeamId]
  );

  const workflowStates = useTeamWorkflowStates(selectedTeam?.slug ?? "");

  const statusOptions = React.useMemo(
    () =>
      getSelectableWorkflowStates(workflowStates).map((state) => ({
        value: state.id,
        label: state.name,
        icon: getWorkflowIcon(state.type),
        color: state.color,
      })),
    [workflowStates]
  );

  const labelOptions = useTeamLabels(selectedTeam?.slug ?? "");

  const projectOptions = React.useMemo(() => {
    const options =
      selectedTeam?.projects?.map((p) => ({
        value: p.id,
        label: p.name,
      })) ?? [];

    return [{ value: "", label: "No project" }, ...options];
  }, [selectedTeam]);

  React.useEffect(() => {
    if (dialogOpen && triggerDraftId && triggerDraft) {
      form.reset({
        title: triggerDraft.title ?? "",
        description: parsedDescription ?? editor.children,
        status:
          triggerDraft.status ??
          getDefaultWorkflowStateId(activeOrganization?.teams[0]?.workflowStates),
        priority: triggerDraft.priority ?? priorityOptions[0].value,
        labels: (triggerDraft.labels as string[]) ?? [],
        teamId: triggerDraft.teamId ?? activeOrganization?.teams[0]?.id ?? "",
        projectId: triggerDraft.projectId ?? null,
      });

      if (parsedDescription) {
        editor.tf.setValue(parsedDescription);
      } else {
        editor.tf.reset();
      }
    }
  }, [
    dialogOpen,
    triggerDraftId,
    triggerDraft,
    parsedDescription,
    form,
    editor,
    activeOrganization,
    priorityOptions,
  ]);

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
      if (!open && hasTitle && !isDefaultDescription && activeOrganization) {
        saveDraftMutation.mutate({
          data: {
            id: triggerDraftId,
            title: form.state.values.title,
            description: form.state.values.description,
            status: form.state.values.status,
            priority: form.state.values.priority,
            labels: form.state.values.labels,
            teamId: form.state.values.teamId,
            projectId: form.state.values.projectId,
            creatorId: user.id,
            organizationId: activeOrganization.id,
          },
        });
      }
      setDialogOpen(open);
      qc.invalidateQueries({ queryKey: issueDraftQueries.all() });
      qc.invalidateQueries({ queryKey: organizationQueries.all() });
    }
  }

  function handleSaveDraft() {
    if (!activeOrganization) return;
    saveDraftMutation.mutate(
      {
        data: {
          title: form.state.values.title,
          description: form.state.values.description,
          status: form.state.values.status,
          priority: form.state.values.priority,
          labels: form.state.values.labels,
          teamId: form.state.values.teamId,
          projectId: form.state.values.projectId,
          creatorId: user.id,
          organizationId: activeOrganization.id,
        },
      },
      {
        onSuccess: (data) => {
          setDialogOpen(false);
          setConfirmationOpen(false);
          qc.invalidateQueries({ queryKey: issueDraftQueries.all() });
          qc.invalidateQueries({ queryKey: organizationQueries.all() });
          const id = toast.success("Issue draft saved", {
            action: (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setDialogOpen(true);
                  setTriggerDraftId(data.id);
                  toast.dismiss(id);
                }}
              >
                Open draft
              </Button>
            ),
          });
        },
      }
    );
  }

  if (isPending) {
    return null;
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
        className="top-[16%] mt-6 flex max-h-[calc(100%-4rem)] min-w-3xl translate-y-[-16%] flex-col overflow-hidden data-ending-style:top-[16%] data-starting-style:top-[16%] sm:max-w-none"
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
              disabled={(activeOrganization?.teams?.length ?? 0) <= 1}
              value={selectedTeam}
              itemToStringLabel={(item) => item.name}
              onValueChange={(value) => {
                if (value) {
                  form.setFieldValue("teamId", value.id);

                  const currentStatus = form.getFieldValue("status");
                  const isValidStatus = value.workflowStates.some(
                    (s) => s.id === currentStatus
                  );
                  if (!isValidStatus) {
                    form.setFieldValue(
                      "status",
                      getDefaultWorkflowStateId(value.workflowStates)
                    );
                  }
                }
              }}
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
                  {activeOrganization?.teams.map((team) => (
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
                  triggerProps={{
                    tooltip: {
                      content: "Change status",
                      kbd: ["S"],
                      tooltipProps: {
                        collisionAvoidance: {
                          side: "flip",
                        },
                      },
                    },
                  }}
                  kbd="S"
                />
              )}
            />
            {projectOptions.length > 1 && (
              <form.Field
                name="projectId"
                children={(field) => (
                  <ItemsCombobox
                    id={field.name}
                    name={field.name}
                    items={projectOptions}
                    value={
                      projectOptions.find(
                        (option) => option.value === field.state.value
                      ) ?? projectOptions[0]
                    }
                    onValueChange={(value) =>
                      field.handleChange(value?.value || "")
                    }
                    placeholder="Set project..."
                    triggerProps={{
                      tooltip: {
                        content: "Set project",
                        kbd: ["G"],
                        tooltipProps: {
                          collisionAvoidance: {
                            side: "flip",
                          },
                        },
                      },
                    }}
                    kbd="G"
                  />
                )}
              />
            )}
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
                  triggerProps={{
                    tooltip: {
                      content: "Set priority",
                      kbd: ["P"],
                      tooltipProps: {
                        collisionAvoidance: {
                          side: "flip",
                        },
                      },
                    },
                  }}
                  kbd="P"
                />
              )}
            />
            <form.Field
              name="labels"
              children={(field) => (
                <MultiItemsCombobox
                  id={field.name}
                  name={field.name}
                  items={labelOptions}
                  value={labelOptions.filter((option) =>
                    field.state.value.includes(option.value)
                  )}
                  onValueChange={(value) =>
                    field.handleChange(value.map((v) => v.value))
                  }
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
