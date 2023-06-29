import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const flatRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.flat.findMany();
  }),
  getUserFlatByFlatIdAndContext: privateProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userFlat.findUnique({
        where: {
          userFlatId: {
            userId: ctx.currentUser,
            flatId: input.id,
          },
        },
      });
    }),
  createFlat: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.currentUser;

    // If not, create a new flat
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
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.currentUser;

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
        throw new TRPCError({ code: "BAD_REQUEST", message: "User is already associated with this flat" });
      }

      return flat;
    }),

});
