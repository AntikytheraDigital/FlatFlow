import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "./../root";
import superjson from "superjson";
import { createInnerTRPCContext } from "./../trpc";

export async function ssgHelper() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: await createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });
}
