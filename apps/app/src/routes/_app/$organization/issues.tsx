import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$organization/issues')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/$workspace/issues"!</div>
}
