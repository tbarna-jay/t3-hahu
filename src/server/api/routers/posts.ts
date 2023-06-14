import { type User, clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '~/server/api/trpc';

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    userName: `${user.firstName || ''} ${user.lastName || ''}`,
    profileImageUrl: user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100, orderBy: { createdAt: 'desc' } });
    const users = (await clerkClient.users.getUserList({ userId: posts.map((post) => post.authorId), limit: 100 })).map(
      filterUserForClient
    );

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      if (!author) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'author of the post not found' });
      return {
        post,
        author,
      };
    });
  }),
  create: privateProcedure.input(z.object({ content: z.string().min(1).max(255) })).mutation(async ({ ctx, input }) => {
    const authorId = ctx.userId;

    const post = await ctx.prisma.post.create({
      data: {
        authorId,
        content: input.content,
      },
    });
    return post;
  }),
});
