import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const publicLinks = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username } = req.query as { username: string };

  switch (req.method) {
    case "GET":
      const user = await prisma.user.findUnique({
        where: {
          name: username,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const links = await prisma.link.findMany({
        where: {
          userId: user.id,
        },
      });

      if (links.length === 0) {
        res.status(200).json(links);
        return;
      }

      res.status(200).json(
        links.map((curr) => {
          return {
            title: curr.title,
            url: curr.url,
          };
        })
      );

      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
      break;
  }
};

export default publicLinks;
