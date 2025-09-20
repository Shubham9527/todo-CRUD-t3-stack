import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const todoRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const todos = ctx.db.todo.findMany({
      orderBy: { createdAt: "desc" },
    });

    return todos;
  }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      const todo = ctx.db.todo.create({
        data: {
          title: input.title,
        },
      });

      return todo;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        isCompleted: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const updatedTodo = ctx.db.todo.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          isCompleted: input.isCompleted,
        },
      });

      return updatedTodo;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedTodo = await ctx.db.todo.delete({
        where: {
          id: input.id,
        },
      });

      return deletedTodo.id;
    }),
});
