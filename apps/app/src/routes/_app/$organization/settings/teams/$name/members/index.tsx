import { ArrowLeft01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackButton } from "@/components/back-button";
import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";
import {
  SettingsTable,
  SettingsTableAction,
  SettingsTableContainer,
  SettingsTableHeader,
  SettingsTableTitle,
} from "@/components/settings/settings-table";

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
          <SettingsTableAction cols={2}>
            <div className="gap-2">
              <InputGroup className="w-full max-w-xs">
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
                </InputGroupAddon>
              </InputGroup>
              <Select
                items={viewOptions}
                defaultValue={viewOptions[0]}
                itemToStringValue={(item) => item.value}
                itemToStringLabel={(item) => item.label}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {viewOptions.map((option) => (
                      <SelectItem key={option.value} value={option}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="justify-end">
              <Button>Add a member</Button>
            </div>
          </SettingsTableAction>
        </SettingsTableHeader>
        <SettingsTable columns={columns} data={data?.teammembers || []} />
      </SettingsTableContainer>
    </SettingsContainer>
  );
}
