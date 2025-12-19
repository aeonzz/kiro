import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";

export const get = createServerFn({ method: "GET" })
  .middleware([loggerMiddleware])
  .handler(async () => {
    return "";
  });
