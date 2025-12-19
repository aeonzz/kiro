import { createStart } from "@tanstack/react-start";

import sidebarMiddleware from "./middlewares/sidebar";

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [sidebarMiddleware],
  };
});
