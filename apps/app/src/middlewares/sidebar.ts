import { parseCookies } from "@/utils/parse-cookies";
import { createMiddleware } from "@tanstack/react-start";

const sidebarMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const cookies = parseCookies(request.headers.get("cookie"));
    const sidebarState = cookies.sidebar_state === "true";

    return next({
      context: {
        sidebarState,
      },
    });
  }
);

export default sidebarMiddleware;
