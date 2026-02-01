import { createFileRoute } from "@tanstack/react-router";

import { useIssueDrafts } from "@/hooks/use-issue-draft-store";
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

import { IssueDraftList } from "./-components/issue-draft-list";

export const Route = createFileRoute("/_app/$organization/drafts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { organization } = Route.useParams();
  const { clearDrafts, drafts } = useIssueDrafts(organization);

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
                  onClick={() => clearDrafts()}
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
