import * as React from "react";
import { Pen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { formOptions, useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

import { authClient } from "@/lib/auth-client";
import { organizationQueries } from "@/lib/query-factory";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  SettingsCard,
  SettingsGroup,
  SettingsItem,
  SettingsItemContent,
  SettingsItemControl,
  SettingsItemTitle,
} from "@/components/ui/settings-card";
import { useOrganization } from "@/components/organization-context";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Your full name cannot be empty.")
    .max(48, "Your full name must be at most 48 characters."),
  slug: z
    .string()
    .min(5, "Slug must be at least 5 characters.")
    .max(32, "Slug must be at most 32 characters.")
    .transform((v) => v.toLowerCase())
    .refine(
      (v) => /^[a-z0-9-]+$/.test(v),
      "Slug can only contain letters, numbers, and dashes."
    ),
});

export function General({
  ...props
}: React.ComponentProps<typeof SettingsGroup>) {
  const router = useRouter();
  const qc = useQueryClient();
  const { activeOrganization } = useOrganization();
  const [slugError, setSlugError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  const mutation = useMutation({
    ...organizationQueries.mutations.update(),
  });

  const form = useForm({
    defaultValues: {
      name: activeOrganization?.name,
      slug: activeOrganization?.slug,
    },
    validators: {
      onSubmit: formSchema,
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!activeOrganization) return;

      if (value.slug === activeOrganization.slug && open) {
        setOpen(false);
        return;
      }

      if (value.slug && value.slug !== activeOrganization.slug) {
        const { error, data } = await authClient.organization.checkSlug({
          slug: value.slug,
        });

        if (!data?.status) {
          setSlugError("This organization URL is already taken");
          return;
        }
        if (error) {
          toast.error(error || "Something went wrong");
          return;
        }
      }

      await mutation.mutateAsync(
        {
          data: {
            id: activeOrganization.id,
            payload: value,
          },
        },
        {
          onSuccess: (data) => {
            const isSlugChanged = data?.slug !== activeOrganization.slug;

            setOpen(false);
            if (isSlugChanged && data) {
              const prevData = qc.getQueryData(
                organizationQueries.detail({
                  slug: activeOrganization.slug,
                }).queryKey
              );

              if (prevData) {
                qc.setQueryData(
                  organizationQueries.detail({
                    slug: data.slug,
                  }).queryKey,
                  {
                    ...prevData,
                    ...data,
                  }
                );
              }

              qc.removeQueries({
                queryKey: organizationQueries.detail({
                  slug: activeOrganization.slug,
                }).queryKey,
              });

              router.navigate({
                to: "/$organization/settings/workspace",
                params: {
                  organization: data.slug,
                },
                replace: true,
              });
            }

            router.invalidate();

            qc.invalidateQueries({
              queryKey: organizationQueries.all(),
            });
            toast("Organization updated.", {
              description: "Your organization has been updated.",
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
                    <SettingsItemTitle>Name</SettingsItemTitle>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </SettingsItemContent>
                  <SettingsItemControl>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={() => {
                        field.handleBlur();
                        if (
                          field.state.value &&
                          field.state.value !== activeOrganization?.name
                        ) {
                          void form.handleSubmit();
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.handleChange(val);
                      }}
                      placeholder="Full name"
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      className="w-72"
                      maxLength={48}
                    />
                  </SettingsItemControl>
                </SettingsItem>
              );
            }}
          />
          <SettingsItem>
            <SettingsItemContent>
              <SettingsItemTitle>URL</SettingsItemTitle>
            </SettingsItemContent>
            <SettingsItemControl>
              <Dialog
                open={open}
                onOpenChange={setOpen}
                onOpenChangeComplete={() => {
                  form.reset();
                  setSlugError(null);
                }}
              >
                <DialogTrigger
                  nativeButton={false}
                  render={<InputGroup className="w-72" />}
                >
                  <InputGroupAddon>
                    <InputGroupText>kiro.app/</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    className="pl-0.5!"
                    value={activeOrganization?.slug}
                    readOnly
                  />
                  <InputGroupAddon
                    align="inline-end"
                    className="opacity-0 group-hover/input-group:opacity-100"
                  >
                    <HugeiconsIcon icon={Pen01Icon} strokeWidth={2} />
                  </InputGroupAddon>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Change organization URL</DialogTitle>
                    <DialogDescription>
                      This will change all your URLs and old ones will be
                      redirected
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    id="update-organization-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                  >
                    <form.Field
                      name="slug"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Enter the new organization URL
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupAddon>
                                <InputGroupText>kiro.app/</InputGroupText>
                              </InputGroupAddon>
                              <InputGroupInput
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  field.handleChange(val);
                                  setSlugError(null);
                                }}
                                aria-invalid={isInvalid || !!slugError}
                                autoComplete="off"
                                placeholder={activeOrganization?.slug}
                                className="pl-0.5!"
                              />
                            </InputGroup>
                            {slugError && <FieldError>{slugError}</FieldError>}
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </form>
                  <DialogFooter>
                    <form.Subscribe
                      selector={(state) => state.isSubmitting}
                      children={(isSubmitting) => (
                        <React.Fragment>
                          <DialogClose
                            disabled={isSubmitting}
                            render={<Button variant="outline">Cancel</Button>}
                          >
                            Cancel
                          </DialogClose>
                          <Button
                            type="submit"
                            form="update-organization-form"
                            variant="destructive"
                            disabled={isSubmitting}
                          >
                            Update
                          </Button>
                        </React.Fragment>
                      )}
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SettingsItemControl>
          </SettingsItem>
        </SettingsCard>
      </form>
    </SettingsGroup>
  );
}
