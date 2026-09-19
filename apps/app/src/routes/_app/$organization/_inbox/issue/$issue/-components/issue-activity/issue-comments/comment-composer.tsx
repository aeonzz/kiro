import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { TooltipContent } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";

export function CommentComposer({
  avatarUrl,
  avatarLabel,
  placeholder,
  variant = "standalone",
  onSubmit,
}: {
  avatarUrl?: string;
  avatarLabel: string;
  placeholder: string;
  variant?: "standalone" | "inline";
  onSubmit: (body: string) => void;
}) {
  const form = useForm({
    defaultValues: { body: "" },
    onSubmit: ({ value, formApi }) => {
      const trimmed = value.body.trim();
      if (!trimmed) {
        toast.info("Comment required", {
          description: "Please add a comment before submitting.",
        });
        return;
      }
      onSubmit(trimmed);
      formApi.reset();
    },
  });

  const isInline = variant === "inline";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <Field>
        <InputGroup
          className={cn(
            "bg-card ring-0!",
            isInline ? "rounded-none border-0 shadow-none" : "px-3 py-2"
          )}
        >
          {isInline && (
            <InputGroupAddon align="inline-start" className="self-start pt-2">
              <UserAvatar
                avatarUrl={avatarUrl}
                label={avatarLabel}
                className="size-5!"
                fallbackClassName="text-[10px]"
                withHoverCard={false}
              />
            </InputGroupAddon>
          )}
          <form.Field
            name="body"
            children={(field) => (
              <InputGroupTextarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void form.handleSubmit();
                  }
                }}
                placeholder={placeholder}
                rows={1}
                autoComplete="off"
                className={cn("min-h-9", isInline && "min-h-0 py-1.5")}
              />
            )}
          />
          <InputGroupAddon
            align={isInline ? "inline-end" : "block-end"}
            className={isInline ? "self-end pb-2" : "justify-end"}
          >
            <InputGroupButton
              type="submit"
              variant="secondary"
              size="icon-xs"
              tooltip={
                <TooltipContent
                  className="flex flex-col gap-1.5"
                  collisionAvoidance={{ side: "flip" }}
                >
                  <div className="space-x-2">
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>Enter</Kbd>
                    </KbdGroup>
                    <span>to submit comment</span>
                  </div>
                  <div className="space-x-2">
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>Alt</Kbd>
                      <Kbd>Enter</Kbd>
                    </KbdGroup>
                    <span>to submit comment and resolve the thread</span>
                  </div>
                </TooltipContent>
              }
            >
              <HugeiconsIcon icon={ArrowUp02Icon} className="size-4" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  );
}
