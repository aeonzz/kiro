/// <reference types="vite/client" />
import * as React from "react";
import { getSessionFn } from "@/services/auth";
import { seo } from "@/utils/seo";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createMiddleware } from "@tanstack/react-start";
import { evlogErrorHandler } from "evlog/nitro/v3";

import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/not-found";
import Providers from "@/components/providers";
import {
  readOfflineCache,
  SESSION_CACHE_KEY,
  writeOfflineCache,
} from "@/lib/offline-cache";
import appCss from "@/styles/app.css?url";

type SessionResult = Awaited<ReturnType<typeof getSessionFn>>;

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  server: {
    middleware: [createMiddleware().server(evlogErrorHandler)],
  },
  beforeLoad: async () => {
    // Runs on every navigation. `getSessionFn` is a server RPC, so it rejects
    // offline — fall back to the last known session (cached on the client) so
    // navigation keeps working locally instead of throwing.
    try {
      const session = await getSessionFn();
      writeOfflineCache(SESSION_CACHE_KEY, session);
      return { session };
    } catch (err) {
      const cached = readOfflineCache<SessionResult>(SESSION_CACHE_KEY);
      if (cached) {
        return { session: cached };
      }
      throw err;
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Kiro",
        description:
          "Kiro is a project management app designed to help you organize and track your projects.",
      }),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      data-cursor-pointer="default"
      data-font-size="default"
    >
      <head>
        <HeadContent />
      </head>
      <body className="bg-background isolate h-screen">
        <Providers>{children}</Providers>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
