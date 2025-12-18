import * as React from "react";
import { createOrganizationFn } from "@/features/organization/create";
import { OrganizationInput } from "@/features/organization/schema";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import * as z from "zod";

import { authClient } from "@/lib/auth-client";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";
import { Spinner } from "./ui/spinner";

const formSchema = z.object({
  organizationName: z
    .string()
    .min(5, "Workspace name must be at least 5 characters.")
    .max(32, "Workspace name must be at most 32 characters."),
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

export function CreateOrganization() {
  const navigate = useNavigate();
  const createOrganization = useServerFn(createOrganizationFn);
  const [slugLock, setSlugLock] = React.useState(false);
  const [slugLoading, setSlugLoading] = React.useState(false);
  const [slugError, setSlugError] = React.useState<string | null>(null);

  const checkSlug = useDebounceCallback(async (slug: string) => {
    if (!slug || slug.length < 5) {
      setSlugError(null);
      return;
    }

    setSlugLoading(true);

    const { error, data } = await authClient.organization.checkSlug({
      slug,
    });

    if (!data?.status) {
      setSlugError("This organization URL is already taken");
    } else if (error) {
      setSlugError(error || "Something went wrong");
    } else {
      setSlugError(null);
    }

    setSlugLoading(false);
  }, 500);

  const { mutateAsync } = useMutation({
    mutationFn: (data: OrganizationInput) => createOrganization({ data }),
  });

  const form = useForm({
    defaultValues: {
      organizationName: "",
      slug: "",
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (slugError || slugLoading) {
        return;
      }
      const { organizationName, slug } = value;
      await mutateAsync(
        {
          name: organizationName,
          slug,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/",
              reloadDocument: true,
              replace: true,
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Workspace</CardTitle>
        <CardDescription>
          Create a new workspace to organize your projects and collaborate with
          your team.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          id="create-workspace-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="organizationName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Workspace Name</FieldLabel>
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
                            .toLowerCase()
                            .replace(/\s+(?=[a-z0-9])/g, "-");
                          form.setFieldValue("slug", newSlug);
                          checkSlug(newSlug);
                        }
                      }}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    <FieldDescription>
                      This is the name of your new workspace.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="slug"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Organization URL
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onFocus={() => setSlugLock(true)}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          checkSlug(e.target.value);
                        }}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      <InputGroupAddon>
                        <InputGroupText>kiro.app/</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        {slugLoading && <Spinner />}
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      This is the URL friendly slug for your workspace.
                    </FieldDescription>
                    {slugError && <FieldError>{slugError}</FieldError>}
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <Button
              type="submit"
              form="create-workspace-form"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              Create organization
            </Button>
          )}
        />
      </CardFooter>
    </Card>
  );
}
