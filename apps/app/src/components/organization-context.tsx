import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import type { Organization, Team } from "better-auth/plugins";

import { HomeViewValue } from "@/config/preferences";
import { authClient } from "@/lib/auth-client";
import { organizationQueries } from "@/lib/query-factory";
import { usePreferencesStore } from "@/hooks/use-preference-store";
import { NotFound } from "@/components/not-found";

interface OrganizationContextValue {
  organizations: Organization[] | undefined;
  isPending: boolean;
  activeOrganization?: (Organization & { userRole?: string | null }) | null;
  teams: Array<
    Omit<Team, "updatedAt"> & {
      slug: string;
      updatedAt?: Date;
    }
  >;
  userRole?: string | null;
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
    authClient.useListOrganizations();
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

  const {
    data: organization,
    isPending,
    isError,
  } = useQuery({
    ...organizationQueries.detail({ slug: effectiveSlug! }),
    enabled: !!effectiveSlug,
  });

  if (!isPending && slug && !isReserved && !organization) {
    return <NotFound />;
  }

  React.useEffect(() => {
    if (slug && !isReserved) {
      if (isPending || !organization) return;
      document.cookie = `active_org=${organization.id}; path=/; max-age=31536000; SameSite=Lax`;
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
    isPending,
    organization,
    userOrganizationsPending,
    slug,
    isReserved,
    pathSegments.length,
    effectiveSlug,
    homeView,
  ]);

  const value = React.useMemo(() => {
    return {
      organizations: userOrganizations ?? [],
      isPending: (isPending && !isReserved) || userOrganizationsPending,
      activeOrganization: organization,
      teams:
        organization?.teams.map((t) => ({
          ...t,
          updatedAt: t.updatedAt ?? undefined,
        })) ?? [],
      userRole: organization?.userRole,
    };
  }, [
    userOrganizations,
    isPending,
    userOrganizationsPending,
    organization,
    isReserved,
  ]);

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
