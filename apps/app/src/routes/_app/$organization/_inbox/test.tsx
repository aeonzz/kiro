import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$organization/_inbox/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/$organization/_inbox-layout/test"!</div>
}
