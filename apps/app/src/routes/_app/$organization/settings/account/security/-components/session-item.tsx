import * as React from "react";
import { getGeolocationFn } from "@/services/utils/geolocation";
import {
  ChromeIcon,
  SafariIcon,
  BrowserIcon as WebBrowserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { Session } from "better-auth";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { authQueries } from "@/lib/query-factory";
import { formatUserAgent, getBrowserName } from "@/lib/ua-parser";
import { cn } from "@/lib/utils";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SettingsItem,
  SettingsItemContent,
  SettingsItemControl,
  SettingsItemDescription,
  SettingsItemMedia,
  SettingsItemTitle,
} from "@/components/ui/settings-card";

import {
  sessionAlertDialogHandle,
  type SessionAlertDialogHandlePayload,
} from "./sessions";

interface SessionItemProps extends React.ComponentProps<typeof SettingsItem> {
  session: Session;
  isCurrent: boolean;
}

export function SessionItem({
  session,
  isCurrent,
  className,
  ...props
}: SessionItemProps) {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: location, isLoading: isLocationLoading } = useQuery({
    queryKey: ["geolocation", session.ipAddress],
    queryFn: () => getGeolocationFn({ data: session.ipAddress ?? "" }),
    enabled: !!session.ipAddress,
  });

  const { mutate, isPending } = useMutation({
    ...authQueries.revokeSession(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authQueries.all() });
      toast.success("revoked session successfully");
    },
    onError: () => {
      toast.error("Failed to revoke session");
    },
  });

  const browserName = getBrowserName(session.userAgent).toLowerCase();
  const BrowserIcon =
    browserName.includes("chrome") || browserName.includes("chromium")
      ? ChromeIcon
      : browserName.includes("safari")
        ? SafariIcon
        : WebBrowserIcon;
  const userAgent = formatUserAgent(session.userAgent);

  const alertDialogPayload: SessionAlertDialogHandlePayload = {
    title: isCurrent ? "Log out" : "Revoke session",
    description: isCurrent
      ? "You will be logged out of this session."
      : "Are you sure you want to revoke this session?",
    confirmLabel: isCurrent ? "Log out" : "Revoke",
    onConfirm: () => {
      if (isCurrent) {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              setTimeout(() => {
                navigate({
                  to: "/login",
                  reloadDocument: true,
                });
              }, 1000);
            },
            onError: () => {
              toast.error("Failed to sign out");
            },
          },
        });
      } else {
        mutate({ data: { token: session.token } });
      }
    },
  };

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={false}
        render={
          <SettingsItem
            className={cn("group/session-item", className)}
            {...props}
          />
        }
      >
        <SettingsItemMedia variant="icon" className="bg-muted/50 p-2">
          <HugeiconsIcon
            icon={BrowserIcon}
            strokeWidth={2}
            className="size-4"
          />
        </SettingsItemMedia>
        <SettingsItemContent>
          <SettingsItemTitle>{userAgent}</SettingsItemTitle>
          <SettingsItemDescription className="flex flex-wrap items-center gap-1.5">
            {isCurrent ? (
              <>
                <span className="flex items-center gap-1 font-medium whitespace-nowrap text-green-500">
                  <span className="size-1.5 rounded-full bg-green-500" />
                  Current session
                </span>
                {location && (
                  <span className="text-muted-foreground">
                    • {location.city}, {location.country}
                  </span>
                )}
                {isLocationLoading && (
                  <span className="text-muted-foreground">• Locating...</span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">
                {location
                  ? `${location.city}, ${location.country}`
                  : isLocationLoading
                    ? "Locating..."
                    : session.ipAddress || "Unknown IP"}
                {" • "}
                Last seen{" "}
                {formatDistanceToNow(session.updatedAt, {
                  addSuffix: true,
                })}
              </span>
            )}
          </SettingsItemDescription>
        </SettingsItemContent>
        <SettingsItemControl>
          <AlertDialogTrigger
            handle={sessionAlertDialogHandle}
            payload={alertDialogPayload}
            render={
              <Button
                variant="ghost"
                className="opacity-0 group-hover/session-item:opacity-100"
              />
            }
            disabled={isPending}
            onClick={(e) => e.stopPropagation()}
          >
            {isCurrent ? "Log out" : isPending ? "Revoking" : "Revoke"}
          </AlertDialogTrigger>
        </SettingsItemControl>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="flex-row items-center gap-2">
          <div className="bg-muted/50 rounded-lg p-2">
            <HugeiconsIcon
              icon={BrowserIcon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
          <DialogTitle className="text-sm-plus font-medium">
            {userAgent}
          </DialogTitle>
        </DialogHeader>
        <div className="divide-border divide-y">
          <div className="flex py-4">
            <span className="text-foreground w-40 text-sm font-medium">
              Device
            </span>
            <span className="text-foreground/80 text-sm">{userAgent}</span>
          </div>
          <div className="flex py-4">
            <span className="text-foreground w-40 text-sm font-medium">
              IP address
            </span>
            <span className="text-foreground/80 font-mono text-sm tracking-tight">
              {session.ipAddress || "Unknown"}
            </span>
          </div>
          <div className="flex py-4">
            <span className="text-foreground w-40 text-sm font-medium">
              Last location
            </span>
            <span className="text-foreground/80 text-sm">
              {location
                ? `${location.city}, ${location.country}`
                : isLocationLoading
                  ? "Locating..."
                  : "Unknown"}
            </span>
          </div>
          <div className="flex py-4">
            <span className="text-foreground w-40 text-sm font-medium">
              Original sign in
            </span>
            <span className="text-foreground/80 text-sm">
              {format(new Date(session.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <DialogFooter>
          <AlertDialogTrigger
            handle={sessionAlertDialogHandle}
            payload={alertDialogPayload}
            render={<Button variant="destructive" />}
            disabled={isPending}
          >
            {isCurrent ? "Log out" : "Revoke"}
          </AlertDialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
