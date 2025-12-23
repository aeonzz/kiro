import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$organization/team/$team/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/$organization/team/$team/"!</div>
}
