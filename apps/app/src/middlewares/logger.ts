import { createMiddleware } from "@tanstack/react-start";
import pino from "pino";

const logger = pino({
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});

const loggerMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next, data }) => {
    const start = Date.now();
    try {
      const result = await next();
      const duration = Date.now() - start;
      logger.info(
        {
          duration,
          data,
        },
        "Request completed"
      );
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(
        {
          duration,
          error,
          data,
        },
        "Request failed"
      );
      throw error;
    }
  }
);

export default loggerMiddleware;
