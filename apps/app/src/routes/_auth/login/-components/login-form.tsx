import * as React from "react";
import { GithubIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = React.useState(false);

  async function signInWithGithub() {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider: "github",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex flex-col items-center gap-2 font-medium">
            <div className="from-muted-foreground to-muted flex size-10 items-center justify-center rounded-full bg-radial-[at_25%_25%] to-75%" />
            <span className="sr-only">Kiro</span>
          </div>
          <h1 className="text-xl font-bold">Welcome to Kiro</h1>
          <FieldDescription>Sign in to continue</FieldDescription>
        </div>
        <Field className="flex flex-col gap-3">
          {/* Uncomment for google provider */}
          {/* <Button
            variant="secondary"
            size="lg"
            type="button"
            disabled={loading}
            onClick={signInWithGithub}
          >
            <HugeiconsIcon icon={GoogleIcon} strokeWidth={2} />
            Continue with Google
          </Button> */}
          <Button
            variant="secondary"
            size="lg"
            type="button"
            disabled={loading}
            onClick={signInWithGithub}
          >
            <HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
            Continue with GitHub
          </Button>
        </Field>
      </FieldGroup>
    </div>
  );
}
