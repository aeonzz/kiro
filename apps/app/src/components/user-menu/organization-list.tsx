import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthenticatedSession } from "@/hooks/use-session";

import { useOrganization } from "../organization-context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";

interface OrganizationListProps extends React.ComponentProps<
  typeof DropdownMenuItem
> {
  setOpen: (open: boolean) => void;
}

export function OrganizationList({ setOpen }: OrganizationListProps) {
  const session = useAuthenticatedSession();
  const { organizations } = useOrganization();
  const navigate = useNavigate();
  const [switching, setSwitching] = React.useState(false);

  async function switchOrganization(value: string) {
    const org = organizations?.find((o) => o.id === value);
    if (!org || org.id === session.session.activeOrganizationId) return;

    await authClient.organization.setActive(
      {
        organizationId: org.id,
        organizationSlug: org.slug,
      },
      {
        onRequest: () => {
          setOpen(false);
          setSwitching(true);
        },
        onSuccess: () => {
          navigate({
            to: `/${org.slug}/inbox`,
            reloadDocument: true,
            replace: true,
          });
          setSwitching(false);
        },
        onError: () => {
          setSwitching(false);
          toast.error("Failed to switch organization");
        },
      }
    );
  }

  return (
    <DropdownMenuRadioGroup
      value={session.session.activeOrganizationId}
      onValueChange={switchOrganization}
    >
      {organizations?.map((organization) => (
        <DropdownMenuRadioItem
          key={organization.id}
          value={organization.id}
          className={cn("py-1.5", switching && "cursor-wait")}
        >
          <Avatar className="size-5 after:rounded-sm">
            <AvatarImage
              src={organization.logo ?? undefined}
              alt={organization.name ?? ""}
            />
            <AvatarFallback className="rounded-sm text-[9.5px] leading-none">
              {organization.name?.slice(0, 2).toUpperCase() ?? "??"}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{organization.name}</span>
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
