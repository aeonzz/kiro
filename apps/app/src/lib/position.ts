const INITIAL_GAP = 1000;

/** Returns a float between `before` and `after`. Pass null for open ends. */
export function getPositionBetween(
  before: number | null,
  after: number | null
): number {
  if (before === null && after === null) return INITIAL_GAP;
  if (before === null) return after! - INITIAL_GAP;
  if (after === null) return before + INITIAL_GAP;
  return (before + after) / 2;
}

/** Assign evenly-spaced initial positions to a list of issue IDs. */
export function assignInitialPositions(
  issueIds: string[]
): Record<string, number> {
  return Object.fromEntries(
    issueIds.map((id, i) => [id, (i + 1) * INITIAL_GAP])
  );
}
