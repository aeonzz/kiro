import { ArrowLeft01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BackButton } from "@/components/back-button";
import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";
import {
  SettingsTable,
  SettingsTableContainer,
  SettingsTableHeader,
  SettingsTableTitle,
} from "@/components/settings/settings-table";

import { memberInvitationDialogHandle } from "../../../-components/member-invitation-dialog";
import { MemberActionItems } from "./-components/actions";
import { columns } from "./-components/columns";

export const Route = createFileRoute(
  "/_app/$organization/settings/teams/$name/members/"
)({
  loader: async ({ params: { organization, name }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueries.detail({ organizationSlug: organization, slug: name })
    );

    if (!data) {
      throw notFound();
    }

    return {
      title: `${data.name} > Members`,
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : undefined,
  }),
  errorComponent: Error,
  notFoundComponent: () => {
    return <NotFound />;
  },
  component: RouteComponent,
});

const viewOptions = [
  { value: "all", label: "All" },
  { value: "member", label: "Member" },
];

function RouteComponent() {
  const { name, organization } = Route.useParams();

  const { data } = useSuspenseQuery(
    teamQueries.detail({ organizationSlug: organization, slug: name })
  );

  return (
    <SettingsContainer type="table">
      <BackButton
        to="/$organization/settings/teams/$name"
        variant="ghost"
        className="text-muted-foreground w-fit"
        showTooltip={false}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        <span>{data?.name}</span>
      </BackButton>
      <SettingsTableContainer>
        <SettingsTableHeader>
          <SettingsTableTitle>Team members</SettingsTableTitle>
        </SettingsTableHeader>
        <SettingsTable
          columns={columns}
          data={data?.teammembers || []}
          filterColumn="email"
          filterPlaceholder="Filter by email..."
          filterOptions={viewOptions}
          getRowContextMenu={(row) => (
            <MemberActionItems row={{ original: row } as any} isContext />
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button />}>
              Add a member
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="w-full"
                  render={
                    <DialogTrigger handle={memberInvitationDialogHandle} />
                  }
                >
                  <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} />
                  <span>Invite people</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SettingsTable>
      </SettingsTableContainer>
    </SettingsContainer>
  );
}
