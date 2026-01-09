import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { organizationQueries } from "@/lib/query-factory";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  SettingsCard,
  SettingsGroup,
  SettingsGroupTitle,
  SettingsItem,
  SettingsItemContent,
  SettingsItemControl,
  SettingsItemTitle,
} from "@/components/ui/settings-card";
import { useOrganization } from "@/components/organization-context";

export function OrganizationAccess({
  ...props
}: React.ComponentProps<typeof SettingsGroup>) {
  const navigate = useNavigate();
  const { activeOrganization, userRole } = useOrganization();
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const isOwner = userRole === "owner";

  const leaveMutation = useMutation({
    ...organizationQueries.mutations.leaveOrganization(),
  });

  const deleteMutation = useMutation({
    ...organizationQueries.mutations.deleteOrganization(),
  });

  const isPending = leaveMutation.isPending || deleteMutation.isPending;

  async function handleAction() {
    if (!activeOrganization) return;

    if (isOwner) {
      if (!checked) return;
      await deleteMutation.mutateAsync(
        {
          data: {
            organizationId: activeOrganization.id,
          },
        },
        {
          onSuccess: () => {
            setOpen(false);
            toast.success("Organization deleted");
            setTimeout(() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: "/login",
                      reloadDocument: true,
                    });
                  },
                  onError: () => {
                    toast.error("Failed to sign out");
                  },
                },
              });
            }, 2000);
          },
          onError: (error) => {
            toast.error(error?.message ?? "Failed to delete organization");
          },
        }
      );
    } else {
      await leaveMutation.mutateAsync(
        {
          data: {
            organizationId: activeOrganization.id,
          },
        },
        {
          onSuccess: () => {
            setOpen(false);
            toast.success("You have left the organization");
            setTimeout(() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: "/login",
                      reloadDocument: true,
                    });
                  },
                  onError: () => {
                    toast.error("Failed to sign out");
                  },
                },
              });
            }, 2000);
          },
          onError: (error) => {
            toast.error(error?.message ?? "Failed to leave organization");
          },
        }
      );
    }
  }

  return (
    <SettingsGroup {...props}>
      <SettingsGroupTitle>Organization access</SettingsGroupTitle>
      <SettingsCard>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>
              {isOwner ? "Delete organization" : "Leave organization"}
            </SettingsItemTitle>
          </SettingsItemContent>
          <SettingsItemControl>
            <AlertDialog
              open={open}
              onOpenChange={setOpen}
              onOpenChangeComplete={() => {
                setChecked(false);
              }}
            >
              <AlertDialogTrigger
                render={<Button variant="ghostDestructive" />}
              >
                {isOwner ? "Delete" : "Leave"}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isOwner ? "Delete organization?" : "Leave organization?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isOwner
                      ? "This organization will be deleted and all its data will be permanently removed. This action cannot be undone."
                      : "You will no longer be able to access this organization."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {isOwner && (
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={checked}
                      onCheckedChange={setChecked}
                    />
                    <Label htmlFor="terms">
                      I acknowledge that all the organization data will be
                      permanently removed.
                    </Label>
                  </div>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending} variant="ghost">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={isPending || (isOwner && !checked)}
                    onClick={handleAction}
                  >
                    {isOwner ? "Delete" : "Leave"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
