import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

import { userQueries } from "@/lib/query-factory";
import { useAuthenticatedSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  SettingsCard,
  SettingsGroup,
  SettingsItem,
  SettingsItemContent,
  SettingsItemControl,
  SettingsItemTitle,
} from "@/components/ui/settings-card";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Your full name cannot be empty.")
    .max(48, "Your full name must be at most 48 characters."),
});

export function General({
  ...props
}: React.ComponentProps<typeof SettingsGroup>) {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuthenticatedSession();

  const mutation = useMutation({
    ...userQueries.mutations.update(),
  });

  const form = useForm({
    defaultValues: {
      name: user.name,
    },
    validators: {
      onSubmit: formSchema,
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(
        {
          data: {
            name: value.name,
          },
        },
        {
          onSuccess: () => {
            router.invalidate();
            qc.invalidateQueries({
              queryKey: userQueries.all(),
            });
            toast("Profile updated.", {
              description: "Your profile has been updated.",
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
          <SettingsItem>
            <SettingsItemContent>
              <SettingsItemTitle>Profile picture</SettingsItemTitle>
            </SettingsItemContent>
            <SettingsItemControl>
              <Avatar>
                <AvatarImage src={user.image ?? ""} />
                <AvatarFallback>
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </SettingsItemControl>
          </SettingsItem>
          <SettingsItem>
            <SettingsItemContent>
              <SettingsItemTitle>Email</SettingsItemTitle>
            </SettingsItemContent>
            <SettingsItemControl>
              <span className="text-xs-plus font-normal">{user.email}</span>
            </SettingsItemControl>
          </SettingsItem>
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <SettingsItem data-invalid={isInvalid}>
                  <SettingsItemContent>
                    <SettingsItemTitle>Full name</SettingsItemTitle>
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
                          field.state.value !== user.name
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
                      className="w-full max-w-sm"
                      maxLength={48}
                    />
                  </SettingsItemControl>
                </SettingsItem>
              );
            }}
          />
        </SettingsCard>
      </form>
    </SettingsGroup>
  );
}
