import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../server/db/client";
import z from "zod";

const user = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, nextAuthOptions);
  const { id } = req.query as { id: string };

  if (session?.user?.id) {
    switch (req.method) {
      case "GET":
        const user = await prisma.user.findUnique({
          where: {
            id: id,
          },
        });
        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        }
        res.status(200).json(user);
        break;

      case "PATCH":
        const validBody = z.object({
          name: z
            .string()
            .min(3)
            .max(20)
            .regex(/^[a-z0-9]+$/)
            .optional(),
          image: z.string().url().optional(),
        });
        const validation = validBody.safeParse(req.body);
        if (!validation.success) {
          res.status(400).json({ error: "Incorrect body shape" });
          break;
        }
        const parsedData = validation.data;
        if (parsedData.name) {
          const usernameTaken = await prisma.user.findUnique({
            where: {
              name: parsedData.name,
            },
          });
          if (
            usernameTaken ||
            parsedData.name === "dashboard" ||
            parsedData.name === "auth" ||
            parsedData.name === "api"
          ) {
            res.status(400).json({ error: "That username is already taken" });
            break;
          }
        }
        try {
          const updatedUser = await prisma.user.update({
            where: {
              id: id,
            },
            data: { name: parsedData.name, image: parsedData.image },
          });
          res.status(200).json(updatedUser);
        } catch (error) {
          res
            .status(400)
            .json({ error: "There was an error while updating the user" });
        }
        break;

      default:
        res.status(405).json({ error: "Method not allowed" });
        break;
    }
  } else {
    res.status(400).send({
      error: "You must be signed in to use this endpoint",
    });
  }
};

export default user;
