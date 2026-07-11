import * as React from "react";
import { getWorkflowIcon } from "@/config";
import type { WorkflowType } from "@kiro/db";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

import { organizationQueries, teamQueries } from "@/lib/query-factory";
import { Button } from "@/components/ui/button";
import { ColorPicker, colorPickerOptions } from "@/components/ui/color-picker";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import {
  IssueStatusItem,
  IssueStatusItemAction,
  IssueStatusItemContent,
  IssueStatusItemMedia,
} from "./item";

const formSchema = z.object({
  name: z.string().min(1, "Status name is required.").max(32),
  description: z.string().max(120),
  color: z.string().min(1, "Color is required."),
});

type WorkflowStateFormValues = z.infer<typeof formSchema>;

type WorkflowStateFormProps = {
  teamId: string;
  type: WorkflowType;
  onCancel: () => void;
} &
  (
    | {
        mode?: "create";
        stateId?: never;
        initialValues?: never;
      }
    | {
        mode: "edit";
        stateId: string;
        initialValues: WorkflowStateFormValues;
      }
  );

export function WorkflowStateForm({
  teamId,
  type,
  mode = "create",
  stateId,
  initialValues,
  onCancel,
}: WorkflowStateFormProps) {
  const { name, organization } = useParams({
    from: "/_app/$organization/settings/teams/$name/statuses/",
  });
  const qc = useQueryClient();
  const Icon = getWorkflowIcon(type);
  const createMutation = useMutation({
    ...teamQueries.mutations.createWorkflowState(),
  });
  const updateMutation = useMutation({
    ...teamQueries.mutations.updateWorkflowState(),
  });
  const isEditing = mode === "edit";
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: initialValues ?? {
      name: "",
      description: "",
      color: colorPickerOptions[0] as string,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmitInvalid: ({ value }) => {
      if (!value.name.trim()) {
        toast.error("Status name is required.", {
          description: "The status name cannot be empty.",
        });
        return;
      }

      if (!value.color.trim()) {
        toast.error("Color is required.", {
          description: "The status color cannot be empty.",
        });
        return;
      }

      toast.error("Check the highlighted fields.", {
        description: `Update the invalid values and try ${isEditing ? "saving" : "creating"} the status again.`,
      });
    },
    onSubmit: async ({ value }) => {
      const options = {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: teamQueries.detail({
              organizationSlug: organization,
              slug: name,
            }).queryKey,
          });
          qc.invalidateQueries({
            queryKey: organizationQueries.all(),
          });
          toast(isEditing ? "Status updated." : "Status created.", {
            description: isEditing
              ? "The workflow state has been updated."
              : "The workflow state has been added.",
          });
          form.reset();
          onCancel();
        },
        onError: (error: Error) => {
          toast.error(error?.message ?? "Something went wrong");
        },
      };

      if (mode === "edit") {
        if (!stateId) return;

        await updateMutation.mutateAsync(
          {
            data: {
              id: stateId,
              name: value.name,
              description: value.description,
              color: value.color,
            },
          },
          options
        );
        return;
      }

      await createMutation.mutateAsync(
        {
          data: {
            teamId,
            type,
            name: value.name,
            description: value.description,
            color: value.color,
          },
        },
        options
      );
    },
  });

  return (
    <IssueStatusItem
      className="min-h-16 bg-transparent py-3 px-4"
      render={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              form.reset();
              onCancel();
            }
          }}
        />
      }
    >
      <form.Field
        name="color"
        children={(field) => (
          <IssueStatusItemMedia
            className="relative overflow-hidden"
            style={{
              backgroundColor: `color-mix(in oklab, var(--muted) 72%, ${field.state.value})`,
              color: field.state.value,
            }}
          >
            <Field
              data-invalid={!field.state.meta.isValid}
              className="grid size-full place-items-center gap-0"
            >
              <FieldLabel htmlFor={field.name} className="sr-only">
                Color
              </FieldLabel>
              <ColorPicker
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                popoverContentProps={{
                  side: "bottom",
                  align: "center",
                }}
              >
                <Icon size={18} />
              </ColorPicker>
            </Field>
          </IssueStatusItemMedia>
        )}
      />
      <IssueStatusItemContent className="flex-row items-start gap-3">
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="w-44 gap-1">
                <FieldLabel htmlFor={field.name} className="sr-only">
                  Name
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Name"
                  autoComplete="off"
                  maxLength={32}
                  autoFocus
                />
              </Field>
            );
          }}
        />
        <form.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="min-w-0 flex-1 gap-1">
                <FieldLabel htmlFor={field.name} className="sr-only">
                  Description
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  placeholder="Description..."
                  maxLength={120}
                />
              </Field>
            );
          }}
        />
      </IssueStatusItemContent>
      <IssueStatusItemAction className="gap-2 opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            form.reset();
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isEditing ? "Update" : "Create"}
        </Button>
      </IssueStatusItemAction>
    </IssueStatusItem>
  );
}
