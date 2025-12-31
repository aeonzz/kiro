import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";

import { organizationQueries } from "@/lib/query-factory";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useOrganization } from "@/components/organization-context";

const formSchema = z.object({
  emails: z
    .string()
    .min(1, "Please enter at least one email address.")
    .refine((val) => {
      const emails = val
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      return emails.length > 0;
    }, "Please enter at least one email address.")
    .refine((val) => {
      const emails = val
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      const emailSchema = z.email();
      return emails.every((email) => emailSchema.safeParse(email).success);
    }, "One or more email addresses are invalid."),
  teams: z.array(z.string()),
});

export const memberInvitationDialogHandle = DialogPrimitive.createHandle();

interface MemberInvitationDialogProps extends Omit<
  React.ComponentProps<typeof Dialog>,
  "onOpenChangeComplete" | "open" | "onOpenChange"
> {}

export function MemberInvitationDialog({
  handle = memberInvitationDialogHandle,
  ...props
}: MemberInvitationDialogProps) {
  const anchor = useComboboxAnchor();
  const { activeOrganization, teams } = useOrganization();
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const mutation = useMutation({
    ...organizationQueries.mutations.inviteMember(),
  });

  const form = useForm({
    defaultValues: {
      emails: "",
      teams: [] as string[],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const emails = value.emails
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      setOpen(false);
      try {
        await Promise.all(
          emails.map((email) =>
            mutation.mutateAsync({
              data: {
                organizationId: activeOrganization!.id,
                email,
                role: "member",
                teamId: value.teams,
              },
            })
          )
        );

        qc.invalidateQueries({
          queryKey: organizationQueries.all(),
        });

        toast(`${emails.length} invite sent`, {
          description:
            "Invited members have been notified by email to signup for Kiro",
        });
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to send invitations");
      }
    },
  });

  return (
    <Dialog
      handle={handle}
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={() => {
        form.reset();
      }}
      {...props}
    >
      <DialogContent>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Invite to your organization</DialogTitle>
            <DialogDescription className="sr-only">
              Invite people to this team
            </DialogDescription>
          </DialogHeader>
          <form
            id="invite-member-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="emails"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="alice@example.com, bob@example.com..."
                      aria-invalid={isInvalid}
                      className="min-h-20"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />
            <form.Field
              name="teams"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Add to team{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Combobox
                      multiple
                      autoHighlight
                      items={teams.map((t) => t.id)}
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <ComboboxChips ref={anchor}>
                        <ComboboxValue>
                          {(values) => (
                            <React.Fragment>
                              {values.map((value: string) => {
                                const team = teams.find((t) => t.id === value);
                                return (
                                  <ComboboxChip key={value}>
                                    {team?.name || value}
                                  </ComboboxChip>
                                );
                              })}
                              <ComboboxChipsInput
                                placeholder={
                                  values.length > 0 ? "" : "Select teams..."
                                }
                              />
                            </React.Fragment>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>No teams found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => {
                            const team = teams.find((t) => t.id === item);
                            return (
                              <ComboboxItem key={item} value={item}>
                                {team?.name || item}
                              </ComboboxItem>
                            );
                          }}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />
          </form>
          <DialogFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  form="invite-member-form"
                  disabled={!canSubmit || isSubmitting}
                >
                  Send invites
                </Button>
              )}
            />
          </DialogFooter>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
}
