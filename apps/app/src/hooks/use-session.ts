import { useRouteContext } from "@tanstack/react-router";

export function useSession() {
  const { session } = useRouteContext({ from: "__root__" });
  return session;
}

export function useAuthenticatedSession() {
  const { session } = useRouteContext({ from: "/_app" });
  return session;
}
