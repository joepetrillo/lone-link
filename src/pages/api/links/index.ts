import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../server/db/client";
import z from "zod";

function validatePost(body: NextApiRequest["body"]) {
  const validPostBody = z.object({
    title: z
      .string()
      .regex(/^[a-zA-Z0-9 ]+$/)
      .min(1)
      .max(50),
    url: z.string().url(),
  });

  return validPostBody.safeParse(body);
}

function validateDelete(body: NextApiRequest["body"]) {
  const validDeleteBody = z.object({
    id: z.string(),
  });

  return validDeleteBody.safeParse(body);
}

const privateLinks = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, nextAuthOptions);

  if (session?.user?.id) {
    switch (req.method) {
      case "POST":
        const newLinkValidation = validatePost(req.body);

        if (!newLinkValidation.success) {
          res.status(400).json({ error: "Incorrect body shape" });
          break;
        }

        const newLink = newLinkValidation.data;

        const linkCount = await prisma.link.count({
          where: { userId: session.user.id },
        });

        if (linkCount >= 5) {
          res
            .status(400)
            .json({ error: "You have reached the maximum of 5 links" });
          break;
        }

        const link = await prisma.link.create({
          data: {
            userId: session.user.id,
            title: newLink.title,
            url: newLink.url,
          },
        });

        const result = { id: link.id, title: link.title, url: link.url };

        res.status(200).json(result);

        break;

      case "GET":
        const links = await prisma.link.findMany({
          where: {
            userId: session.user.id,
          },
        });

        if (links.length === 0) {
          res.status(200).json(links);
          return;
        }

        res.status(200).json(
          links.map((curr) => {
            return {
              id: curr.id,
              title: curr.title,
              url: curr.url,
            };
          })
        );

        break;

      case "DELETE":
        const deleteLinkValidation = validateDelete(req.body);

        if (!deleteLinkValidation.success) {
          res.status(400).json({ error: "Incorrect body shape" });
          break;
        }

        const targetedLink = deleteLinkValidation.data;

        try {
          const deletedLink = await prisma.link.delete({
            where: { id: targetedLink.id },
          });

          res.status(200).json(deletedLink);
        } catch (error) {
          res
            .status(400)
            .json({ error: "There was an error while deleting the link" });
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

export default privateLinks;
