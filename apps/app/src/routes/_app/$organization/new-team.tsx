import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$organization/new-team')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/$organization/new-team"!</div>
}
