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
  .input(z.object({ id: z.number()}))
  .query(async ({ ctx, input }) => {
        return await ctx.prisma.userFlat.findUnique({
            where: {
              userFlatId: {
                userId: ctx.currentUser,
                flatId: input.id
              }
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
});
