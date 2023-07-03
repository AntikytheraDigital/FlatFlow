import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const flatRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.flat.findMany();
  }),
  getUserFlatByFlatIdAndUserId: publicProcedure
    .input(z.object({ flat_id: z.string(), user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userFlat.findUnique({
        where: {
          userFlatId: {
            userId: input.user_id,
            flatId: input.flat_id,
          },
        },
      });
    }),
  getUserFlatByFlatIdAndContext: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userFlat.findUnique({
        where: {
          userFlatId: {
            userId: ctx.userId,
            flatId: input.id,
          },
        },
      });
    }),
  getAllUserIdsInUserFlatByFlatId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch all UserFlat records associated with the flatId
      const userFlats = await ctx.prisma.userFlat.findMany({
        where: {
          flatId: input.id,
        },
      });

      // Fetch all Users associated with UserFlat records
      const usersIds = userFlats.map((userFlat) => userFlat.userId);

      return usersIds;
    }),
  getAllUserIdsInUserFlat: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch all UserFlat records associated with the flatId
      const userFlats = await ctx.prisma.userFlat.findMany({
        where: {
          flatId: input.id,
        },
      });

      // Fetch all Users associated with UserFlat records
      const usersIds = userFlats.map((userFlat) => userFlat.userId);

      return usersIds;
    }),

  createFlat: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;
    const { success } = await ratelimit.limit(userId);

    if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    //Creates tuple in User from userId if it doesn't exist
    await ctx.prisma.user.upsert({
      where: { userId: userId },
      update: {},
      create: { userId: userId },
    });
    //If not, create a new flat
    const flat = await ctx.prisma.flat.create({
      data: {},
    });

    // Associate the user with the new flat
    await ctx.prisma.userFlat.create({
      data: {
        userId: userId,
        flatId: flat.id,
      },
    });

    // Return the new flat
    return flat;
  }),
  addUserToUserFlat: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const { success } = await ratelimit.limit(userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      // Check if the flat exists
      const flat = await ctx.prisma.flat.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!flat) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check if the user is already in the flat
      const userFlat = await ctx.prisma.userFlat.findUnique({
        where: {
          userId_flatId: {
            userId: userId,
            flatId: input.id,
          },
        },
      });

      // If not, associate the user with the flat
      if (!userFlat) {
        await ctx.prisma.userFlat.create({
          data: {
            userId: userId,
            flatId: input.id,
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already associated with this flat",
        });
      }

      return flat;
    }),
  removeUserFromUserFlat: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      // Check if the flat exists
      const flat = await ctx.prisma.flat.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!flat) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check if the user is in the flat
      const userFlat = await ctx.prisma.userFlat.findUnique({
        where: {
          userId_flatId: {
            userId: userId,
            flatId: input.id,
          },
        },
      });

      // If user is in the flat, remove them
      if (userFlat) {
        await ctx.prisma.userFlat.delete({
          where: {
            userId_flatId: {
              userId: userId,
              flatId: input.id,
            },
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not associated with this flat",
        });
      }

      return flat;
    }),
});
