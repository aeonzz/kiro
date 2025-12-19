import { createServerFn } from "@tanstack/react-start";

export const get = createServerFn({ method: "GET" }).handler(async () => {
  return "";
});
