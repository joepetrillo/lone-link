import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../server/db/client";
import z from "zod";
import { v4 as randomUUID } from "uuid";

type Link = {
  id: string;
  title: string;
  url: string;
};

const getLinks = async (userId: string) => {
  try {
    const row = await prisma.link.findUniqueOrThrow({
      where: { userId },
    });
    // user found, return links array
    return row.links as unknown as Link[];
  } catch (error) {
    // user not found
    throw new Error("The requested user has no links", {
      cause: error,
    });
  }
};

const updateLinks = async (userId: string, links: Link[]) => {
  try {
    await prisma.link.update({
      where: { userId },
      data: { links },
    });
  } catch (error) {
    // record does not exist, throw error
    throw new Error("There was an error updating links on the server", {
      cause: error,
    });
  }
};

const privateLinks = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, nextAuthOptions);

  // user is signed in
  if (session?.user?.id) {
    // create a new link
    if (req.method === "POST") {
      const reqBody = z.object({
        title: z
          .string()
          .regex(/^[a-zA-Z0-9 ]+$/)
          .min(1)
          .max(50),
        url: z.string().url(),
      });

      // validate request body
      try {
        reqBody.parse(req.body);
      } catch (error) {
        return res.status(400).json(error);
      }

      try {
        const links = await getLinks(session.user.id);

        if (links.length >= 5) {
          return res
            .status(400)
            .json({ error: "You have reached the maximum of 5 links" });
        }

        links.push({
          id: randomUUID(),
          title: req.body.title,
          url: req.body.url,
        });

        await updateLinks(session.user.id, links);

        res.status(200).json(links[links.length - 1]);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        }
      }
    }
    // get all links
    else if (req.method === "GET") {
      try {
        const links = await getLinks(session.user.id);
        res.status(200).json(links);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        }
      }
    }
    // delete a link
    else if (req.method === "DELETE") {
      const reqBody = z.object({
        id: z.string(),
      });

      // validate request body
      try {
        reqBody.parse(req.body);
      } catch (error) {
        return res.status(400).json(error);
      }

      try {
        let links = await getLinks(session.user.id);

        const deletedLink = links.find((link) => link.id === req.body.id);

        if (!deletedLink) {
          return res
            .status(400)
            .json({ error: "No links matching the given id were found" });
        }

        links = links.filter((link) => link.id !== req.body.id);

        await updateLinks(session.user.id, links);

        res.status(200).json(deletedLink);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        }
      }
    }
    // update the order of links
    else if (req.method === "PATCH") {
      const reqBody = z.object({
        order: z.string().array(),
      });

      // validate request body
      try {
        reqBody.parse(req.body);
      } catch (error) {
        return res.status(400).json(error);
      }

      try {
        const links = await getLinks(session.user.id);

        const linkPositions: Record<string, number> = {};
        req.body.order.forEach(
          (id: string, index: number) => (linkPositions[id] = index)
        );

        const containsAll = (arr1: string[], arr2: string[]) =>
          arr2.every((arr2Item) => arr1.includes(arr2Item));

        const sameMembers = (arr1: string[], arr2: string[]) =>
          containsAll(arr1, arr2) && containsAll(arr2, arr1);

        if (
          sameMembers(
            links.map((link) => link.id),
            req.body.order
          )
        ) {
          // eslint-disable-next-line
          // @ts-ignore
          links.sort((a, b) => linkPositions[a.id] - linkPositions[b.id]);
        } else {
          res.status(400).json({
            error:
              "The user does not own one or more of the link ids requested to be reordered",
          });
        }

        await updateLinks(session.user.id, links);

        res.status(200).json(links);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        }
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

export default privateLinks;
