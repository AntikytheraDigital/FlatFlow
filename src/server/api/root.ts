import { createTRPCRouter } from "~/server/api/trpc";
import { flatRouter } from "./routers/flat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  flat: flatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
