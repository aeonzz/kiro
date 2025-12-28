import * as React from "react";
import { ArrowRight01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Team } from "@kiro/db";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

import { organizationQueries, teamQueries } from "@/lib/query-factory";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  SettingsCard,
  SettingsGroup,
  SettingsItem,
  SettingsItemContent,
  SettingsItemControl,
  SettingsItemDescription,
  SettingsItemMedia,
  SettingsItemTitle,
} from "@/components/ui/settings-card";
import { useOrganization } from "@/components/organization-context";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters.")
    .max(32, "Team name must be at most 32 characters."),
  slug: z
    .string()
    .min(1, "Slug must be at least 1 characters.")
    .max(7, "Slug must be at most 7 characters.")
    .transform((v) => v.toUpperCase())
    .refine(
      (v) => /^[A-Z0-9-]+$/.test(v),
      "Slug can only contain uppercase letters, numbers, and dashes."
    ),
});

export function General({
  team,
  ...props
}: React.ComponentProps<typeof SettingsGroup> & { team: Team }) {
  const { name, organization } = useParams({
    from: "/_app/$organization/settings/teams/$name/",
  });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { teams } = useOrganization();

  const mutation = useMutation({
    ...teamQueries.mutations.update(),
  });

  const form = useForm({
    defaultValues: {
      name: team.name,
      slug: team.slug,
    },
    validators: {
      onSubmit: formSchema,
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(
        {
          data: {
            id: team.id,
            payload: {
              name: value.name,
              slug: value.slug,
            },
          },
        },
        {
          onSuccess: (data) => {
            const isSlugChanged = data.slug !== team.slug;

            if (isSlugChanged) {
              qc.setQueryData(
                teamQueries.detail({
                  organizationSlug: organization,
                  slug: data.slug,
                }).queryKey,
                data
              );

              qc.removeQueries({
                queryKey: teamQueries.detail({
                  organizationSlug: organization,
                  slug: team.slug,
                }).queryKey,
              });

              navigate({
                to: "/$organization/settings/teams/$name",
                params: {
                  organization,
                  name: data.slug,
                },
              });
            }

            qc.invalidateQueries({
              queryKey: teamQueries.all(),
            });
            qc.invalidateQueries({
              queryKey: organizationQueries.all(),
            });
            toast("Settings updated.", {
              description: "The team settings have been updated.",
            });
          },
          onError: (error) => {
            toast.error(error?.message ?? "Something went wrong");
          },
        }
      );
    },
  });

  const { values, isSubmitting, canSubmit } = useStore(
    form.store,
    (state) => state
  );
  const isDirty =
    (values as any).name !== team.name || (values as any).slug !== team.slug;

  return (
    <SettingsGroup {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <SettingsCard>
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <SettingsItem data-invalid={isInvalid}>
                  <SettingsItemContent>
                    <SettingsItemTitle className="font-normal">
                      Name
                    </SettingsItemTitle>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </SettingsItemContent>
                  <SettingsItemControl>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.handleChange(val);
                      }}
                      placeholder="e.g. Engineering"
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      className="w-full max-w-sm"
                      maxLength={32}
                    />
                  </SettingsItemControl>
                </SettingsItem>
              );
            }}
          />

          <form.Field
            name="slug"
            validators={{
              onChange: ({ value }) => {
                if (value === team.slug) return undefined;
                const isTaken = teams.some((t) => t.slug === value);
                return isTaken
                  ? { message: "This slug is already in use." }
                  : undefined;
              },
            }}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <SettingsItem data-invalid={isInvalid}>
                  <SettingsItemContent>
                    <SettingsItemTitle className="font-normal">
                      Identifier
                    </SettingsItemTitle>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </SettingsItemContent>
                  <SettingsItemControl>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const val = e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9-]/g, "");
                        field.handleChange(val);
                      }}
                      placeholder="e.g. ENG"
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      className="w-full max-w-sm"
                      maxLength={7}
                    />
                  </SettingsItemControl>
                </SettingsItem>
              );
            }}
          />
        </SettingsCard>
        {isDirty && (
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              variant="default"
            >
              Save
            </Button>
          </div>
        )}
      </form>
      <SettingsCard>
        <SettingsItem
          render={
            <Link
              to="/$organization/settings/teams/$name/members"
              params={{
                name,
                organization,
              }}
            />
          }
        >
          <SettingsItemMedia variant="icon">
            <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />
          </SettingsItemMedia>
          <SettingsItemContent>
            <SettingsItemTitle>Members</SettingsItemTitle>
            <SettingsItemDescription>
              Manage team members
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
