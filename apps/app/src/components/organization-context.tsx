import * as React from "react";
import type { StrictOmit } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";

import type { IssueDraft, Member, Organization, Team } from "@/types/schema-types";
import { HomeViewValue } from "@/config/preferences";
import { usePowerSyncOrganizations } from "@/lib/collections/organizations-powersync";
import { usePowerSyncReady } from "@/lib/collections/powersync-bootstrap";
import { issueDraftQueries } from "@/lib/query-factory";
import { useHydrated } from "@/hooks/use-hydrated";
import { usePreferencesStore } from "@/hooks/use-preference-store";
import { useSession } from "@/hooks/use-session";
import { NotFound } from "@/components/not-found";

type ContextOrganization = StrictOmit<
  Organization,
  "invitations" | "members" | "teams"
> & {
  teams: Array<StrictOmit<Team, "teammembers">>;
  issueDrafts: Array<StrictOmit<IssueDraft, "creatorId">>;
  userRole?: string | null;
  members: Array<Member>;
};

interface OrganizationContextValue {
  organizations: Array<ContextOrganization>;
  isPending: boolean;
  activeOrganization: ContextOrganization | null;
}

const OrganizationContext = React.createContext<
  OrganizationContextValue | undefined
>(undefined);

const RESERVED_SLUGS = ["login", "join", "api"];

// Stable context served during SSR and the first hydration render, before the
// browser-only PowerSync provider takes over. Module-level so the reference is
// constant (no spurious re-renders in consumers).
const PENDING_VALUE: OrganizationContextValue = {
  organizations: [],
  isPending: true,
  activeOrganization: null,
};

/**
 * SSR-safe shell. PowerSync collections only exist in the browser, so until the
 * client has hydrated we serve a "pending" context; then we mount the real,
 * client-only provider which reads PowerSync directly (no state-lifting bridge).
 */
export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <OrganizationContext.Provider value={PENDING_VALUE}>
        {children}
      </OrganizationContext.Provider>
    );
  }

  return <OrganizationProviderClient>{children}</OrganizationProviderClient>;
}

/**
 * Client-only provider. Reads the local-first organizations from PowerSync and
 * warms every org-scoped collection in parallel; `ready` gates the whole shell
 * behind one loader (no staggered pop-in) until teams and issues are both ready.
 */
function OrganizationProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const currentUserId = session?.user?.id;

  const { organizations } = usePowerSyncOrganizations();
  const ready = usePowerSyncReady();

  // Cast the local org shape (string dates, empty issueDrafts) to the context
  // org type at this single boundary; downstream consumers read these fields
  // loosely. `issueDrafts` is injected below from the server draft query.
  const userOrganizations = organizations as unknown as ContextOrganization[];
  const userOrganizationsPending = !ready;

  const navigate = useNavigate();
  const location = useLocation();
  const homeView = usePreferencesStore((s) => s.homeView);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const slug = pathSegments[0];
  const isReserved = RESERVED_SLUGS.includes(slug);

  const effectiveSlug = React.useMemo(() => {
    if (slug && !isReserved) return slug;

    if (typeof document === "undefined") return null;

    const cookieMatch = document.cookie.match(/active_org=([^;]+)/);
    const cookieOrgId = cookieMatch ? cookieMatch[1] : null;

    if (cookieOrgId && userOrganizations) {
      const cookieOrg = userOrganizations.find((o) => o.id === cookieOrgId);
      if (cookieOrg) return cookieOrg.slug;
    }

    if (userOrganizations && userOrganizations.length > 0) {
      return userOrganizations[0].slug;
    }

    return null;
  }, [slug, isReserved, userOrganizations]);

  const activeOrganization = React.useMemo(() => {
    if (!userOrganizations || !effectiveSlug) return null;
    return userOrganizations.find((o) => o.slug === effectiveSlug) || null;
  }, [userOrganizations, effectiveSlug]);

  // Issue drafts stay server-backed (not synced to PowerSync). Fetched for the
  // active org and injected onto `activeOrganization` below; empty offline.
  const { data: issueDrafts } = useQuery({
    ...issueDraftQueries.lists({ organizationSlug: effectiveSlug ?? "" }),
    enabled: !!effectiveSlug,
  });

  React.useEffect(() => {
    if (slug && !isReserved) {
      if (userOrganizationsPending || !activeOrganization) return;
      document.cookie = `active_org=${activeOrganization.id}; path=/; max-age=31536000; SameSite=Lax`;
    } else if (pathSegments.length === 0) {
      if (userOrganizationsPending) return;

      if (effectiveSlug) {
        // Map homeView preference to route
        const homeViewRoutes: Record<HomeViewValue, string> = {
          [HomeViewValue.ASSIGNED_ISSUES]: "my-issues/assigned",
          [HomeViewValue.INBOX]: "inbox",
          [HomeViewValue.PROJECTS]: "projects/all",
        };
        const route = homeViewRoutes[homeView] || "inbox";
        navigate({ to: `/${effectiveSlug}/${route}` });
      } else if (userOrganizations && userOrganizations.length === 0) {
        navigate({ to: "/join" });
      }
    }
  }, [
    userOrganizations,
    navigate,
    userOrganizationsPending,
    activeOrganization,
    slug,
    isReserved,
    pathSegments.length,
    effectiveSlug,
    homeView,
  ]);

  const value = React.useMemo(() => {
    const activeOrg = activeOrganization
      ? {
          ...activeOrganization,
          logo: activeOrganization.logo ?? null,
          metadata: activeOrganization.metadata ?? null,
          // Resolve the signed-in user's role (owner checks); empty offline.
          userRole:
            activeOrganization.members?.find((m) => m.userId === currentUserId)
              ?.role ?? null,
          issueDrafts: (issueDrafts ??
            []) as ContextOrganization["issueDrafts"],
        }
      : null;

    return {
      organizations:
        userOrganizations?.map((org) => ({
          ...org,
          logo: org.logo ?? null,
          metadata: org.metadata ?? null,
          teams:
            org.teams.map((t) => ({
              ...t,
              updatedAt: t.updatedAt ?? null,
            })) ?? [],
        })) ?? [],
      isPending: userOrganizationsPending,
      activeOrganization: activeOrg,
    };
  }, [
    userOrganizations,
    userOrganizationsPending,
    activeOrganization,
    issueDrafts,
    currentUserId,
  ]);

  if (!userOrganizationsPending && slug && !isReserved && !activeOrganization) {
    return <NotFound />;
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = React.useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
}
