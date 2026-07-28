import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/not-found";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }

  /**
   * Location state is global rather than per-route, so app-wide keys live here.
   *
   * `fromInbox` marks a navigation that originated from an inbox notification.
   * The issue URL is identical either way (Linear keeps it clean), so the inbox
   * layout reads this to decide between the split view and the standalone page.
   * It deliberately lives in history state, not search params — a shared link
   * should open the standalone issue, not drop a stranger into someone's inbox.
   */
  interface HistoryState {
    fromInbox?: boolean;
  }
}
