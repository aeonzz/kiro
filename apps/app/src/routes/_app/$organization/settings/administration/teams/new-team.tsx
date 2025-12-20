import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/$organization/settings/administration/teams/new-team',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/_app/$organization/settings/administration/teams/new-team"!
    </div>
  )
}
