import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../server/db/client";
import z from "zod";

const profile = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, nextAuthOptions);

  if (session?.user?.id) {
    // update username
    if (req.method === "PATCH") {
      const reqBody = z.object({
        name: z
          .string()
          .min(3)
          .max(20)
          .regex(/^[a-z0-9]+$/)
          .optional(),
        image: z.string().url().optional(),
      });

      // validate request body
      try {
        reqBody.parse(req.body);
      } catch (error) {
        return res.status(400).json(error);
      }

      // check if requested username is already taken or reserved/disallowed
      if (req.body.name) {
        const usernameTaken = await prisma.user.findUnique({
          where: {
            name: req.body.name,
          },
        });
        if (
          usernameTaken ||
          req.body.name === "dashboard" ||
          req.body.name === "auth" ||
          req.body.name === "api"
        ) {
          return res
            .status(400)
            .json({ error: "That username is already taken" });
        }
      }

      try {
        const updatedUser = await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: { name: req.body.name, image: req.body.image },
        });
        res.status(200).json(updatedUser);
      } catch (error) {
        res
          .status(500)
          .json({
            error: "There was an error updating the user on the server",
          });
      }
    }
    // requested method not supported
    else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  // user is not signed in
  else {
    res.status(400).send({
      error: "You must be signed in to use this endpoint",
    });
  }
};

export default profile;
