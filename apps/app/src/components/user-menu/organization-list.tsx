import * as React from "react";
import { useNavigate } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

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
  const { organizations, activeOrganization } = useOrganization();
  const navigate = useNavigate();

  function switchOrganization(value: string) {
    const org = organizations?.find((o) => o.id === value);
    if (!org || org.id === activeOrganization?.id) return;

    setOpen(false);
    navigate({
      to: `/${org.slug}/inbox`,
      reloadDocument: true,
      replace: true,
    });
  }

  return (
    <DropdownMenuRadioGroup
      value={activeOrganization?.id}
      onValueChange={switchOrganization}
    >
      {organizations?.map((organization) => (
        <DropdownMenuRadioItem
          key={organization.id}
          value={organization.id}
          className={cn("py-1.5")}
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
