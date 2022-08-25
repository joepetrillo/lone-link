import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import z from "zod";

const validBody = z.object({
  name: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9]+$/)
    .optional(),
  image: z.string().url().optional(),
});

const user = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };

  switch (req.method) {
    case "GET":
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User Not Found" });
      }

      break;

    case "PATCH":
      const validation = validBody.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({ error: "Incorrect Body Shape" });
        break;
      }

      const parsedData = validation.data;

      if (parsedData.name) {
        const usernameTaken = await prisma.user.findUnique({
          where: {
            name: parsedData.name,
          },
        });

        if (usernameTaken) {
          res.status(404).json({ error: "That username is already taken" });
          break;
        }
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { name: parsedData.name, image: parsedData.image },
      });

      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: "User Not Found" });
      }

      break;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
};

export default user;
