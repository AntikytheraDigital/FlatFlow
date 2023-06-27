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
  getUserFlat: publicProcedure
    .input(z.object({ userId: z.string(), flatId: z.number() }))
    .query(async ({ input, ctx }) => {
      const userFlat = await ctx.prisma.userFlat.findFirst({
        where: {
          userId: input.userId,
          flatId: input.flatId,
        },
        include: {
          Flat: true,
        },
      });

      // Check if a UserFlat was found and return the associated Flat
      if (userFlat) {
        return userFlat.Flat;
      }

      // If no UserFlat was found, return an error
      throw new Error("No Flat found for this User ID and Flat ID");
    }),
  createFlat: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.currentUser;

    // Check if the user is already associated with a flat
    const existingUserFlat = await ctx.prisma.userFlat.findUnique({
      where: { userId: userId },
    });

    if (existingUserFlat) {
      throw new Error("User is already associated with a flat");
    }

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
});
