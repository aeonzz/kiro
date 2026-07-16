import * as React from "react";
import { useStatus } from "@powersync/react";

import { useHydrated } from "@/hooks/use-hydrated";
import { useOnline } from "@/hooks/use-online";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";


export function SyncStatusButton() {
  const hydrated = useHydrated();
  const online = useOnline();
  const status = useStatus();

  if (!hydrated || online) return null;

  const { lastSyncedAt } = status;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Offline"
          />
        }
      >
        <OfflineIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="bottom">
        <DropdownMenuLabel className="flex items-center gap-2">
          <span className="bg-destructive/80 size-1.5 shrink-0 rounded-full" />
          <span>Offline</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem nativeButton disabled className="text-muted-foreground whitespace-normal text-xs">
            You&apos;re offline. Changes will sync when you&apos;re back online.
          </DropdownMenuItem>
          {lastSyncedAt && (
            <DropdownMenuItem nativeButton disabled className="text-muted-foreground text-xs">
              Last synced {lastSyncedAt.toLocaleTimeString()}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OfflineIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
      <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
      <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
      <path d="M5 13a10 10 0 0 1 5.24-2.76" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}
