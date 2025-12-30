import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { organizationQueries, teamQueries } from "@/lib/query-factory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useOrganization } from "@/components/organization-context";

export const teamDeleteAlertDialogHandle =
  AlertDialogPrimitive.createHandle<HandlePayload>();

type HandlePayload = {
  id: string;
  name: string;
  redirect?: boolean;
};

interface DeleteAlertDialogProps extends Omit<
  React.ComponentProps<typeof AlertDialog>,
  "onOpenChangeComplete" | "open" | "onOpenChange"
> {}

export function DeleteAlertDialog({
  handle = teamDeleteAlertDialogHandle,
  ...props
}: DeleteAlertDialogProps) {
  const navigate = useNavigate();
  const { activeOrganization } = useOrganization();
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [confirmName, setConfirmName] = React.useState("");

  const mutation = useMutation({
    ...teamQueries.mutations.delete(),
  });

  async function handleDeleteTeam({ id, name, redirect }: HandlePayload) {
    if (confirmName !== name) return;
    setOpen(false);
    await mutation.mutateAsync(
      {
        data: {
          id,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: organizationQueries.all(),
          });
          qc.invalidateQueries({
            queryKey: teamQueries.all(),
          });
          if (redirect && redirect === true) {
            navigate({
              to: `/$organization/settings/teams`,
              params: {
                organization: activeOrganization?.slug || "",
              },
            });
          }
          toast("Team deleted.", {
            description: "The team has been deleted.",
          });
        },
        onError: (error) => {
          toast.error(error?.message ?? "Something went wrong");
        },
      }
    );
  }

  return (
    <AlertDialog
      handle={handle}
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setConfirmName("");
        }
      }}
      {...props}
    >
      {({ payload }) => (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team? This action cannot be
              undone.
              <br />
              <br />
              To confirm, type the{" "}
              <strong className="text-foreground">
                {payload !== undefined && (payload as HandlePayload).name}
              </strong>{" "}
              name below:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <Input
              autoComplete="off"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={
                payload === undefined ||
                confirmName !== (payload as HandlePayload).name
              }
              onClick={() => {
                handleDeleteTeam(payload as HandlePayload);
              }}
            >
              Delete team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
