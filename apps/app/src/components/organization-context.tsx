import * as React from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import type { Organization, Team } from "better-auth/plugins";

import { authClient } from "@/lib/auth-client";
import { useSession } from "@/hooks/use-session";

interface OrganizationContextValue {
  organizations: Organization[] | undefined;
  isPending: boolean;
  activeOrganization?: Organization;
  teams: Team[];
}

const OrganizationContext = React.createContext<
  OrganizationContextValue | undefined
>(undefined);

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const navigate = useNavigate();
  const location = useLocation();

  const [teams, setTeams] = React.useState<Team[]>([]);

  React.useEffect(() => {
    if (!session?.session) return;

    const activeOrgId = session.session.activeOrganizationId;

    if (activeOrgId && organizations) {
      const activeOrg = organizations.find((org) => org.id === activeOrgId);

      if (activeOrg) {
        document.cookie = `active_org=${activeOrgId}; path=/; max-age=31536000; SameSite=Lax`;

        if (location.pathname === "/") {
          navigate({ to: `/${activeOrg.slug}/inbox` });
        }
      }
    }
  }, [session, organizations, navigate, location.pathname]);

  React.useEffect(() => {
    const activeOrgId = session?.session?.activeOrganizationId;
    if (!activeOrgId) {
      setTeams([]);
      return;
    }

    async function fetchTeams() {
      const { data } = await authClient.organization.listTeams({
        query: {
          organizationId: activeOrgId!,
        },
      });
      if (data) {
        setTeams(data as Team[]);
      }
    }

    void fetchTeams();
  }, [session?.session?.activeOrganizationId]);

  const value = React.useMemo(() => {
    const activeOrganization = organizations?.find(
      (org) => org.id === session?.session?.activeOrganizationId
    );

    return {
      organizations: organizations ?? [],
      isPending,
      activeOrganization,
      teams,
    };
  }, [organizations, isPending, session?.session?.activeOrganizationId, teams]);

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
