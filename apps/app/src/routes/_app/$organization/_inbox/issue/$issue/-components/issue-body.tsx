import * as React from "react";
import type { Value } from "platejs";
import { useNavigate } from "@tanstack/react-router";
import { Plate, usePlateEditor } from "platejs/react";

import {
  getIssuesPowerSyncCollection,
  type PowerSyncIssueDetail,
} from "@/lib/collections/issues-powersync";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";
import { slugifyIssueTitle } from "@/lib/issue-identifier";
import { Textarea } from "@/components/ui/textarea";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/editor/ui/editor";

const AUTOSAVE_DELAY = 600;

function parseDescription(description: string | null): Value | undefined {
  if (!description) return undefined;
  try {
    const parsed = JSON.parse(description) as Value;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function IssueBody({
  issue,
  organization,
  issueIdentifier,
}: {
  issue: PowerSyncIssueDetail;
  organization: string;
  issueIdentifier: string;
}) {
  const issuesCollection = React.useMemo(
    () => getIssuesPowerSyncCollection(),
    []
  );
  const issueId = issue.id;
  const navigate = useNavigate();

  const [title, setTitle] = React.useState(issue.title);

  const persistedDescription = React.useRef(issue.description);

  const editor = usePlateEditor({
    plugins: EditorKit,
    nodeId: { normalizeInitialValue: true },
    value: parseDescription(issue.description),
  });

  const persist = React.useCallback(
    (changes: { title?: string; description?: string }) => {
      issuesCollection.update(issueId, (draft) => {
        Object.assign(draft, changes, { updatedAt: new Date().toISOString() });
      });
    },
    [issuesCollection, issueId]
  );

  const persistTitle = React.useCallback(
    (next: string) => persist({ title: next }),
    [persist]
  );

  // Keep the URL's cosmetic title slug in sync, mirroring Linear - only once
  // the user is done editing, not on every keystroke.
  const syncTitleSlug = React.useCallback(() => {
    void navigate({
      to: "/$organization/issue/$issue/$title",
      params: {
        organization,
        issue: issueIdentifier,
        title: slugifyIssueTitle(title),
      },
      replace: true,
      resetScroll: false,
    });
  }, [navigate, organization, issueIdentifier, title]);

  const persistDescription = React.useCallback(
    (next: string) => {
      persistedDescription.current = next;
      persist({ description: next });
    },
    [persist]
  );

  const debouncedTitle = useDebounceCallback(persistTitle, AUTOSAVE_DELAY);
  const debouncedDescription = useDebounceCallback(
    persistDescription,
    AUTOSAVE_DELAY
  );

  React.useEffect(
    () => () => {
      debouncedTitle.flush();
      debouncedDescription.flush();
    },
    [debouncedTitle, debouncedDescription]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Textarea
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          debouncedTitle(event.target.value);
        }}
        onBlur={() => {
          debouncedTitle.flush();
          syncTitleSlug();
        }}
        className="placeholder:text-muted-foreground/60 min-h-0 shrink-0 py-0 pr-0 pl-7 text-2xl! leading-8 font-semibold shadow-none focus-visible:ring-0"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="Issue title"
        maxLength={512}
      />
      <Plate
        editor={editor}
        onChange={({ value }) => {
          const serialized = JSON.stringify(value);
          if (serialized === persistedDescription.current) return;
          debouncedDescription(serialized);
        }}
      >
        <EditorContainer
          className="flex-1"
          onBlur={() => debouncedDescription.flush()}
        >
          <Editor variant="document" placeholder="Add description..." />
        </EditorContainer>
      </Plate>
    </div>
  );
}
