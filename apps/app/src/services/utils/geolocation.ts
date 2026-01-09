import { createServerFn } from "@tanstack/react-start";
import axios from "redaxios";
import { z } from "zod";

export const getGeolocationFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => d as string)
  .handler(async ({ data: ip }) => {
    if (!ip || ip === "::1" || ip === "127.0.0.1") {
      return { city: "Local", country: "Development" };
    }

    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      const { city, country } = response.data;
      return { city, country };
    } catch (error) {
      console.error("Failed to fetch geolocation:", error);
      return { city: "Unknown", country: "Unknown" };
    }
  });
