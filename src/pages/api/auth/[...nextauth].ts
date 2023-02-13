import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import Email from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      // add user id to session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    createUser: async (message) => {
      // set links to empty array
      await prisma.link.create({
        data: {
          userId: message.user.id,
          links: [],
        },
      });

      // set default image
      await prisma.user.update({
        where: {
          id: message.user.id,
        },
        data: { image: "https://i.imgur.com/6VigAlo.png" },
      });
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Email({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    verifyRequest: "/auth/verify-email",
    newUser: "/auth/setup-profile",
  },
};

export default NextAuth(authOptions);
