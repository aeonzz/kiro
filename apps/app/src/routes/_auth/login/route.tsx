import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginForm } from "./-components/login-form";

export const Route = createFileRoute("/_auth/login")({
  beforeLoad: async ({ context }) => {
    if (context.session?.user) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
