import * as React from "react";
import {
  Calendar04Icon,
  CalendarCheckOut01Icon,
  Cancel01Icon,
  GreaterThanIcon,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { toast } from "sonner";
import * as z from "zod";

import { ProjectStatus } from "@/types/enums";
import { issueFilterOptions, projectStatusOptions } from "@/config/team";
import { projectQueries } from "@/lib/query-factory";
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

import { CopyButton } from "./copy-button";
import { DatePicker } from "./date-picker";
import { EditorKit } from "./editor/editor-kit";
import { Editor, EditorContainer } from "./editor/ui/editor";
import { ItemsCombobox } from "./items-combobox";
import { useOrganization } from "./organization-context";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
} from "./ui/dialog";
import { Kbd, KbdGroup } from "./ui/kbd";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { TooltipContent } from "./ui/tooltip";

const formSchema = z.object({
  name: z.string().max(80),
  summary: z.string().max(255),
  status: z.enum(ProjectStatus),
  priority: z.string(),
  description: z.custom<Value>(),
  teamId: z.string(),
  leadId: z.string(),
  startDate: z.date().nullable(),
  targetDate: z.date().nullable(),
});

export const createProjectDialogHandle = DialogPrimitive.createHandle();

export function CreateProjectDialog() {
  const qc = useQueryClient();
  const { activeOrganization, isPending } = useOrganization();
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const priorityOptions =
    issueFilterOptions.find((option) => option.id === "priority")?.options ??
    [];

  const editor = usePlateEditor({
    plugins: EditorKit,
  });

  const mutation = useMutation({
    ...projectQueries.mutations.create(),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      summary: "",
      description: editor.children,
      status: projectStatusOptions[0].value,
      priority: priorityOptions[0].value,
      teamId: activeOrganization?.teams[0]?.id ?? "",
      leadId: "NO_LEAD",
      startDate: null as Date | null,
      targetDate: null as Date | null,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.name) {
        toast.info("Project name required", {
          description: "The project name cannot be empty",
        });
        return;
      }

      if (!activeOrganization) {
        toast.error("Organization not found", {
          description: "The organization cannot be empty",
        });
        return;
      }

      mutation.mutate(
        {
          data: {
            ...value,
            leadId: value.leadId === "NO_LEAD" ? null : value.leadId,
            organizationId: activeOrganization.id,
          },
        },
        {
          onSuccess: (data) => {
            setDialogOpen(false);
            setConfirmationOpen(false);
            qc.invalidateQueries({ queryKey: projectQueries.all() });
            const id = toast.success("Project created", {
              description: data.name,
              action: (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    toast.dismiss(id);
                  }}
                >
                  Open project
                </Button>
              ),
            });
          },
        }
      );
    },
  });

  const selectedTeamId = useStore(form.store, (state) => state.values.teamId);
  const selectedTeam = React.useMemo(
    () =>
      activeOrganization?.teams.find((t) => t.id === selectedTeamId) ??
      activeOrganization?.teams[0],
    [activeOrganization, selectedTeamId]
  );

  const leadOptions = React.useMemo(() => {
    const options =
      activeOrganization?.members?.map((m) => ({
        value: m.userId,
        label: m.user.name,
        avatarUrl: m.user.image ?? undefined,
      })) ?? [];

    return [
      { value: "NO_LEAD", label: "No lead", avatarUrl: undefined },
      ...options,
    ];
  }, [activeOrganization]);

  function handleOpenChange(open: boolean) {
    const hasName = form.state.values.name.trim().length > 0;
    const hasSummary = form.state.values.summary.trim().length > 0;
    const hasChangedStatus =
      form.state.values.status !== projectStatusOptions[0].value;
    const hasChangedPriority =
      form.state.values.priority !== priorityOptions[0].value;
    const hasChangedTeam =
      form.state.values.teamId !== (activeOrganization?.teams[0]?.id ?? "");
    const hasChangedLead = form.state.values.leadId !== "NO_LEAD";
    const hasStartDate = form.state.values.startDate !== null;
    const hasTargetDate = form.state.values.targetDate !== null;

    const description = form.state.values.description;
    const isDefaultDescription =
      description?.length === 1 &&
      description[0].type === "p" &&
      description[0].children?.length === 1 &&
      description[0].children[0].text === "";
    const hasDescription = !isDefaultDescription;

    const hasChanges =
      hasName ||
      hasSummary ||
      hasChangedStatus ||
      hasChangedPriority ||
      hasChangedTeam ||
      hasChangedLead ||
      hasStartDate ||
      hasTargetDate ||
      hasDescription;

    if (!open && hasChanges) {
      setConfirmationOpen(true);
    } else {
      setDialogOpen(open);
    }
  }

  if (isPending) {
    return null;
  }

  return (
    <Dialog
      handle={createProjectDialogHandle}
      open={dialogOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(open) => {
        if (!open) {
          form.reset();
          editor.tf.reset();
        }
      }}
    >
      <DialogContent
        flush
        className="top-[16%] mt-6 flex h-full max-h-[calc(100%-4rem)] min-w-3xl -translate-y-[16%] flex-col overflow-hidden data-ending-style:top-[16%] data-starting-style:top-[16%] sm:max-w-4xl"
        hideCloseIcon
      >
        <DialogHeader className="h-fit flex-row items-center justify-between px-3! pt-3! pb-1">
          <DialogTitle className="sr-only">New project</DialogTitle>
          <div className="flex items-center gap-1.5">
            <Select
              disabled={(activeOrganization?.teams?.length ?? 0) <= 1}
              value={selectedTeam}
              itemToStringLabel={(item) => item.name}
              onValueChange={(value) => {
                if (value) {
                  form.setFieldValue("teamId", value.id);
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
              New Project
            </span>
          </div>
          <div className="flex items-center gap-1.5">
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
          id="create-project-form"
          className="mx-8 my-4 flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex h-full min-h-32 flex-1 flex-col gap-3">
            <div>
              <form.Field
                name="name"
                children={(field) => {
                  return (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="placeholder:text-muted-foreground/60 min-h-0 shrink-0 px-0 py-1 text-2xl! font-semibold shadow-none focus-visible:ring-0"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Project name"
                      maxLength={80}
                      autoFocus
                    />
                  );
                }}
              />
              <form.Field
                name="summary"
                children={(field) => {
                  return (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="placeholder:text-muted-foreground/60 text-sm-plus! min-h-0 shrink-0 px-0 py-1 font-normal shadow-none focus-visible:ring-0"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Add a short summary..."
                      maxLength={255}
                    />
                  );
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <form.Field
                name="status"
                children={(field) => (
                  <ItemsCombobox
                    id={field.name}
                    name={field.name}
                    items={projectStatusOptions}
                    value={projectStatusOptions.find(
                      (option) => option.value === field.state.value
                    )}
                    onValueChange={(value) =>
                      field.handleChange(
                        value?.value || projectStatusOptions[0].value
                      )
                    }
                    placeholder="Change status..."
                    triggerProps={{
                      tooltip: {
                        content: "Change project status",
                        kbd: ["P", "then", "S"],
                        tooltipProps: {
                          collisionAvoidance: {
                            side: "flip",
                          },
                        },
                      },
                    }}
                    kbd={["P", "then", "S"]}
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
                      field.handleChange(
                        value?.value || priorityOptions[0].value
                      )
                    }
                    placeholder="Change priority..."
                    triggerProps={{
                      tooltip: {
                        content: "Change project priority",
                        kbd: ["P", "then", "P"],
                        tooltipProps: {
                          collisionAvoidance: {
                            side: "flip",
                          },
                        },
                      },
                    }}
                    kbd={["P", "then", "S"]}
                    isMuted={field.state.value === "NO_PRIORITY"}
                  />
                )}
              />
              <form.Field
                name="leadId"
                children={(field) => (
                  <ItemsCombobox
                    id={field.name}
                    name={field.name}
                    items={leadOptions}
                    value={leadOptions.find(
                      (option) => option.value === field.state.value
                    )}
                    onValueChange={(value) =>
                      field.handleChange(value?.value || leadOptions[0].value)
                    }
                    placeholder="Set lead..."
                    triggerProps={{
                      tooltip: {
                        content: "Set project lead",
                        kbd: ["P", "then", "A"],
                        tooltipProps: {
                          collisionAvoidance: {
                            side: "flip",
                          },
                        },
                      },
                    }}
                    kbd={["P", "then", "A"]}
                    isMuted={field.state.value === "NO_LEAD"}
                  />
                )}
              />
              <form.Field
                name="startDate"
                children={(field) => (
                  <DatePicker
                    value={field.state.value}
                    label="Start date"
                    onValueChange={(value) => {
                      field.handleChange(value ?? null);
                    }}
                    trigger={(v) => (
                      <Button
                        variant="outline"
                        size="xs"
                        tooltip={{
                          content: "Set project start date",
                          kbd: ["Ctrl", "Alt", "S"],
                          tooltipProps: {
                            collisionAvoidance: {
                              side: "flip",
                            },
                          },
                        }}
                      >
                        <HugeiconsIcon
                          icon={CalendarCheckOut01Icon}
                          strokeWidth={2}
                        />
                        {v ? format(v, "PPP") : <span>Start</span>}
                      </Button>
                    )}
                  />
                )}
              />
              <form.Field
                name="targetDate"
                children={(field) => (
                  <DatePicker
                    value={field.state.value}
                    label="Target date"
                    onValueChange={(value) => {
                      field.handleChange(value ?? null);
                    }}
                    trigger={(v) => (
                      <Button
                        variant="outline"
                        size="xs"
                        tooltip={{
                          content: "Set project target date",
                          kbd: ["Ctrl", "Alt", "D"],
                          tooltipProps: {
                            collisionAvoidance: {
                              side: "flip",
                            },
                          },
                        }}
                      >
                        <HugeiconsIcon icon={Calendar04Icon} strokeWidth={2} />
                        {v ? format(v, "PPP") : <span>Target</span>}
                      </Button>
                    )}
                  />
                )}
              />
            </div>
            <Separator className="mt-4 mb-2" />
            <form.Field
              name="description"
              children={(field) => (
                <Plate
                  editor={editor}
                  onChange={({ value }) => field.handleChange(value)}
                >
                  <EditorContainer className="flex-1 overflow-y-auto">
                    <Editor
                      variant="textarea"
                      placeholder="Write a description, a project brief, or collect ideas..."
                      className="px-0 py-0"
                    />
                  </EditorContainer>
                </Plate>
              )}
            />
          </div>
        </form>
        <DialogFooter className="mt-auto p-3.5">
          <DialogClose
            render={
              <Button
                variant="secondary"
                size="sm"
                tooltip={{
                  content: "Cancel",
                  kbd: ["Esc"],
                }}
              />
            }
          >
            Cancel
          </DialogClose>
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button
                type="submit"
                form="create-project-form"
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
                    <span className="flex items-center gap-1">
                      Press
                      <KbdGroup>
                        <Kbd>Ctrl</Kbd>
                        <Kbd>Enter</Kbd>
                      </KbdGroup>
                      to create project
                    </span>
                    <span className="flex items-center gap-1">
                      Hold
                      <Kbd>Alt</Kbd>
                      to open project
                    </span>
                  </TooltipContent>
                }
              >
                Create project
              </Button>
            )}
          />
        </DialogFooter>
      </DialogContent>
      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard this project?</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm that you want to discard this project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setDialogOpen(false);
                setConfirmationOpen(false);
              }}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
