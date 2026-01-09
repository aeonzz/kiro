import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "better-auth";
import { toast } from "sonner";

import { authQueries } from "@/lib/query-factory";
import { useAuthenticatedSession } from "@/hooks/use-session";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  SettingsCard,
  SettingsGroup,
  SettingsGroupDescription,
  SettingsGroupHeader,
  SettingsGroupTitle,
} from "@/components/ui/settings-card";

import { SessionItem } from "./session-item";

export type SessionAlertDialogHandlePayload = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
};

export const sessionAlertDialogHandle =
  AlertDialogPrimitive.createHandle<SessionAlertDialogHandlePayload>();

interface SessionsProps extends React.ComponentProps<typeof SettingsGroup> {
  sessions: Session[];
}

export function Sessions({ sessions, ...props }: SessionsProps) {
  const queryClient = useQueryClient();
  const { session: currentSessionData } = useAuthenticatedSession();

  const { mutate, isPending } = useMutation({
    ...authQueries.revokeOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueries.all() });
      toast.success("You have been logged out of all other sessions.");
    },
    onError: () => {
      toast.error("Failed to revoke sessions");
    },
  });

  const currentSessionId = currentSessionData.id;
  const allSessions = sessions;

  const currentSession = allSessions.find((s) => s.id === currentSessionId);
  const otherSessions = allSessions.filter((s) => s.id !== currentSessionId);

  return (
    <React.Fragment>
      <SettingsGroup {...props}>
        <SettingsGroupHeader>
          <SettingsGroupTitle>Sessions</SettingsGroupTitle>
          <SettingsGroupDescription>
            Devices logged into your account
          </SettingsGroupDescription>
        </SettingsGroupHeader>

        {currentSession && (
          <SettingsCard>
            <SessionItem session={currentSession} isCurrent={true} />
          </SettingsCard>
        )}

        {otherSessions.length > 0 && (
          <SettingsCard>
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <span className="text-xs-plus font-medium">
                {otherSessions.length} other{" "}
                {otherSessions.length === 1 ? "session" : "sessions"}
              </span>
              <AlertDialogTrigger
                handle={sessionAlertDialogHandle}
                render={<Button variant="ghost" />}
                payload={
                  {
                    title: "Revoke access",
                    description:
                      "Revoke all other sessions? This cannot be undone.",
                    confirmLabel: "Revoke",
                    onConfirm: () => mutate(),
                  } as SessionAlertDialogHandlePayload
                }
                disabled={isPending}
              >
                Revoke all
              </AlertDialogTrigger>
            </div>
            {otherSessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isCurrent={false}
              />
            ))}
          </SettingsCard>
        )}
      </SettingsGroup>
      <AlertDialog handle={sessionAlertDialogHandle}>
        {({ payload }) => {
          if (!payload) {
            return null;
          }

          const data = payload as SessionAlertDialogHandlePayload;

          return (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{data.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {data.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    data.onConfirm();
                    sessionAlertDialogHandle.close();
                  }}
                >
                  {data.confirmLabel}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          );
        }}
      </AlertDialog>
    </React.Fragment>
  );
}
