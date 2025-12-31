import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { organizationQueries } from "@/lib/query-factory";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";
import {
  SettingsTable,
  SettingsTableContainer,
  SettingsTableHeader,
  SettingsTableTitle,
} from "@/components/settings/settings-table";

import { memberInvitationDialogHandle } from "../-components/member-invitation-dialog";
import { MemberActionItems } from "./-components/actions";
import { columns } from "./-components/columns";

export const Route = createFileRoute("/_app/$organization/settings/members/")({
  loader: async ({ params: { organization }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      organizationQueries.detail({ slug: organization })
    );

    if (!data) {
      throw notFound();
    }
  },
  head: () => ({
    meta: [{ title: "Members", description: "Members" }],
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
    organizationQueries.detail({ slug: organization })
  );

  return (
    <SettingsContainer type="table">
      <SettingsTableContainer>
        <SettingsTableHeader>
          <SettingsTableTitle>Teams</SettingsTableTitle>
        </SettingsTableHeader>
        <SettingsTable
          columns={columns}
          data={data?.members || []}
          filterColumn="email"
          filterPlaceholder="Filter by email..."
          filterOptions={viewOptions}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          getRowContextMenu={(row) => (
            <MemberActionItems row={{ original: row } as any} isContext />
          )}
        >
          <Button variant="outline">Export CSV</Button>
          <Button
            render={<DialogTrigger handle={memberInvitationDialogHandle} />}
          >
            Invite
          </Button>
        </SettingsTable>
      </SettingsTableContainer>
    </SettingsContainer>
  );
}
