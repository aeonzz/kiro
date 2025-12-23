import * as React from "react";
import { createTeamFn } from "@/services/team/create";
import type { CreateTeamSchemaType } from "@/services/team/schema";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import * as z from "zod";

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
  SettingsItemTitle,
} from "@/components/ui/settings-card";
import { useOrganization } from "@/components/organization-context";
import SettingsContainer from "@/components/settings-container";

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

export const Route = createFileRoute("/_app/$organization/settings/new-team")({
  component: RouteComponent,
});

function RouteComponent() {
  const qc = useQueryClient();
  const { activeOrganization } = useOrganization();
  const createTeam = useServerFn(createTeamFn);
  const navigate = useNavigate();
  const [slugLock, setSlugLock] = React.useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: (data: CreateTeamSchemaType) => createTeam({ data }),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!activeOrganization) return;

      await mutateAsync(
        {
          organizationId: activeOrganization.id,
          ...value,
        },
        {
          onSuccess: (data) => {
            qc.invalidateQueries({
              queryKey: ["get_organization", activeOrganization.slug],
            });
            navigate({
              to: `/$organization/settings/administration/teams/$name`,
              params: {
                organization: activeOrganization.slug,
                name: data.slug,
              },
            });
          },
          onError: (error) => {
            toast.error(error?.message ?? "Something went wrong");
          },
        }
      );
    },
  });

  return (
    <SettingsContainer>
      <div className="space-y-2">
        <h1 className="text-foreground text-2xl font-medium">
          Create a new team
        </h1>
        <p className="text-muted-foreground text-sm">
          Create a new team to manage your organization's projects and issues.
        </p>
      </div>
      <SettingsGroup className="mt-6">
        <form
          id="create-team-form"
          onSubmit={(e) => {
            e.preventDefault();
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
                      <SettingsItemTitle>Team name</SettingsItemTitle>
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : (
                        <SettingsItemDescription>
                          This is the display name of your team.
                        </SettingsItemDescription>
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
                          if (!slugLock) {
                            const newSlug = val
                              .slice(0, 3)
                              .toUpperCase()
                              .replace(/[^A-Z0-9-]/g, "");
                            form.setFieldValue("slug", newSlug);
                          }
                        }}
                        placeholder="e.g. Engineering"
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        autoFocus
                        className="w-56"
                        maxLength={32}
                      />
                    </SettingsItemControl>
                  </SettingsItem>
                );
              }}
            />
            <form.Field
              name="slug"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <SettingsItem data-invalid={isInvalid}>
                    <SettingsItemContent>
                      <SettingsItemTitle>Team slug</SettingsItemTitle>
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : (
                        <SettingsItemDescription>
                          The slug is used to identify the team in URLs and
                          other places.
                        </SettingsItemDescription>
                      )}
                    </SettingsItemContent>
                    <SettingsItemControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onFocus={() => setSlugLock(true)}
                        onChange={(e) => {
                          const val = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9-]/g, "");
                          field.handleChange(val);
                        }}
                        placeholder="e.g. ENG"
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        className="w-56"
                        maxLength={7}
                      />
                    </SettingsItemControl>
                  </SettingsItem>
                );
              }}
            />
          </SettingsCard>
        </form>
      </SettingsGroup>
      <div className="mt-4 flex justify-end">
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <Button
              type="submit"
              form="create-team-form"
              disabled={isSubmitting}
            >
              Create team
            </Button>
          )}
        />
      </div>
    </SettingsContainer>
  );
}
