import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$organization/my-issues/assigned')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/$organization/my-issues/assigned"!</div>
}
