import * as React from "react";
import type { StrictOmit } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";

import type { IssueDraft, Organization, Team } from "@/types/schema-types";
import { HomeViewValue } from "@/config/preferences";
import { organizationQueries } from "@/lib/query-factory";
import { usePreferencesStore } from "@/hooks/use-preference-store";
import { NotFound } from "@/components/not-found";

type ContextOrganization = StrictOmit<
  Organization,
  "invitations" | "members" | "teams"
> & {
  teams: Array<StrictOmit<Team, "teammembers">>;
  issueDrafts: Array<StrictOmit<IssueDraft, "creatorId">>;
  userRole?: string | null;
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

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userOrganizations, isPending: userOrganizationsPending } =
    useQuery(organizationQueries.list());
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
          userRole: activeOrganization.members?.[0]?.role ?? null,
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
  }, [userOrganizations, userOrganizationsPending, activeOrganization]);

  // if (!userOrganizationsPending && slug && !isReserved && !activeOrganization) {
  //   return <NotFound />;
  // }

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
