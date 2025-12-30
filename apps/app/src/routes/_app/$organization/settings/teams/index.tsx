import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import { Button } from "@/components/ui/button";
import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";
import {
  SettingsTable,
  SettingsTableContainer,
  SettingsTableHeader,
  SettingsTableTitle,
} from "@/components/settings/settings-table";

import { TeamActionItems } from "./-components/actions";
import { columns } from "./-components/columns";

export const Route = createFileRoute("/_app/$organization/settings/teams/")({
  loader: async ({ params: { organization }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueries.lists({ organizationSlug: organization })
    );

    if (!data) {
      throw notFound();
    }
  },
  head: () => ({
    meta: [{ title: "Teams", description: "Teams" }],
  }),
  errorComponent: Error,
  notFoundComponent: () => {
    return <NotFound />;
  },
  component: RouteComponent,
});

const viewOptions = [
  { value: "all", label: "All teams" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function RouteComponent() {
  const { organization } = Route.useParams();

  const { data } = useSuspenseQuery(
    teamQueries.lists({ organizationSlug: organization })
  );

  return (
    <SettingsContainer type="table">
      <SettingsTableContainer>
        <SettingsTableHeader>
          <SettingsTableTitle>Teams</SettingsTableTitle>
        </SettingsTableHeader>
        <SettingsTable
          columns={columns}
          data={data || []}
          filterColumn="name"
          filterPlaceholder="Filter by name..."
          filterOptions={viewOptions}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          getRowLink={(row) => ({
            to: "/$organization/settings/teams/$name",
            params: {
              organization,
              name: row.slug,
            },
          })}
          getRowContextMenu={(row) => (
            <TeamActionItems row={{ original: row } as any} isContext />
          )}
        >
          <Button
            nativeButton={false}
            render={
              <Link
                to="/$organization/settings/new-team"
                params={{
                  organization,
                }}
              />
            }
          >
            Create a team
          </Button>
        </SettingsTable>
      </SettingsTableContainer>
    </SettingsContainer>
  );
}
