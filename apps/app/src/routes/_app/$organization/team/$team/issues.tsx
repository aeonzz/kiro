import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$organization/team/$team/issues')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/$organization/team/$team/issues"!</div>
}
