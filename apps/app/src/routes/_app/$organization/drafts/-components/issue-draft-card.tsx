import * as React from "react";
import type { StrictOmit } from "@/types";
import { DeleteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";
import { formatDistanceToNowStrict } from "date-fns";
import { Plate, usePlateEditor } from "platejs/react";

import { cn } from "@/lib/utils";
import {
  useIssueDrafts,
  useIssueDraftStore,
  type IssueDraft,
} from "@/hooks/use-issue-draft-store";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createIssueDialogHandle } from "@/components/create-issue-dialog";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/editor/ui/editor";

interface IssueDraftCardProps extends StrictOmit<
  React.ComponentProps<typeof Card>,
  "children"
> {
  draft: IssueDraft;
}

export function IssueDraftCard({
  draft,
  className,
  ...props
}: IssueDraftCardProps) {
  const { organization } = useParams({ strict: false });
  const { deleteDraft } = useIssueDrafts(organization);
  const setTriggerDraftId = useIssueDraftStore(
    (state) => state.setTriggerDraftId
  );

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: draft.description,
  });

  React.useEffect(() => {
    if (editor && draft.description) {
      editor.tf.withoutNormalizing(() => {
        const children = [...editor.children];
        for (let i = children.length - 1; i >= 0; i--) {
          editor.tf.removeNodes({ at: [i] });
        }
        editor.tf.insertNodes(draft.description, { at: [0] });
      });
    }
  }, [draft.description, editor]);

  return (
    <DialogTrigger
      nativeButton={false}
      id={draft.id}
      handle={createIssueDialogHandle}
      onClick={() => setTriggerDraftId(draft.id)}
      render={
        <Card
          className={cn(
            "relative h-34.5 gap-2 rounded-sm pb-0 hover:bg-[color-mix(in_oklab,var(--card)_97%,var(--card-foreground))]",
            className
          )}
          {...props}
        >
          <CardHeader className="relative">
            <div className="flex w-full items-center gap-2">
              <CardTitle className="text-xs-plus">{draft.title}</CardTitle>
              <span className="text-micro text-muted-foreground">
                {formatDistanceToNowStrict(draft.updatedAt)}
              </span>
            </div>
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghostPopup"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover/card:opacity-100"
                        />
                      }
                    />
                  }
                >
                  <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span>Discard draft</span>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your draft will be deleted
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDraft(draft.id);
                    }}
                    variant="destructive"
                  >
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent className="relative h-full overflow-hidden">
            <Plate editor={editor} readOnly>
              <EditorContainer className="pointer-events-none">
                <Editor
                  variant="textarea"
                  placeholder="Add description..."
                  className="text-xs-plus text-muted-foreground p-px"
                />
              </EditorContainer>
            </Plate>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_80%,var(--card)_99%)] group-hover/card:bg-[linear-gradient(to_bottom,transparent_80%,color-mix(in_oklab,var(--card)_97%,var(--card-foreground))_99%)]" />
          </CardContent>
        </Card>
      }
    />
  );
}
