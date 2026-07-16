import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { issueDraftQueries, organizationQueries } from "@/lib/query-factory";
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
import { Container, ContainerHeader } from "@/components/container";
import { Error } from "@/components/error";

import { IssueDraftList } from "./-components/issue-draft-list";

export const Route = createFileRoute("/_app/$organization/drafts/")({
  errorComponent: Error,
  component: RouteComponent,
});

function RouteComponent() {
  const { organization } = Route.useParams();
  const qc = useQueryClient();

  // Drafts are server-backed (not synced to PowerSync). Non-suspense query so
  // navigation completes offline with an empty list instead of hanging.
  const { data } = useQuery(
    issueDraftQueries.lists({
      organizationSlug: organization,
    })
  );
  const drafts = data ?? [];

  const clearMutation = useMutation({
    ...issueDraftQueries.mutations.clear(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: issueDraftQueries.all() });
    },
  });

  return (
    <Container>
      <ContainerHeader inset>
        <h2>Drafts</h2>
        {drafts.length > 0 && (
          <AlertDialog>
            <Button
              className="ml-auto"
              variant="ghost"
              size="xs"
              tooltip={{
                content: "Discard all drafts",
              }}
              render={AlertDialogTrigger}
            >
              Discard all
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard all drafts?</AlertDialogTitle>
                <AlertDialogDescription>
                  All your drafts will be deleted
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    clearMutation.mutate(
                      { data: { slug: organization } },
                      {
                        onSuccess: () => {
                          qc.invalidateQueries({
                            queryKey: issueDraftQueries.all(),
                          });
                          qc.invalidateQueries({
                            queryKey: organizationQueries.all(),
                          });
                        },
                      }
                    )
                  }
                  variant="destructive"
                >
                  Discard all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </ContainerHeader>
      <IssueDraftList drafts={drafts} />
    </Container>
  );
}
