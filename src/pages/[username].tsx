import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicLink from "../components/PublicLink";
import { prisma } from "../server/db/client";

interface PublicUserPageProps {
  user: {
    name: string;
    image: string;
  } | null;
  links: Array<{
    title: string;
    url: string;
  }> | null;
}

const PublicUserPage: NextPage<PublicUserPageProps> = ({ user, links }) => {
  return (
    <div className="text-lg text-slate-800">
      {user ? (
        <div className="mx-auto mt-20 mb-20 max-w-screen-md px-4 ">
          <div className="mb-10 flex flex-col items-center justify-center gap-2">
            <Image
              width={100}
              height={100}
              src={user.image}
              alt="profile picture"
            />
            <span>@{user.name}</span>
          </div>
          <main>
            {links &&
              (links.length > 0 ? (
                links.map(({ title, url }, index) => {
                  return <PublicLink key={index} title={title} url={url} />;
                })
              ) : (
                <p className="text-center">This user has no links</p>
              ))}
          </main>
        </div>
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-center gap-2">
          <p>This user does not exist</p>
          <p>
            <Link href="/auth/signin" className="underline">
              Sign up
            </Link>{" "}
            to claim this page
          </p>
        </main>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params as { username: string };

  const user = await prisma.user.findUnique({
    where: {
      name: username,
    },
  });

  // user not found
  if (!user) {
    return {
      props: {
        user: null,
        links: null,
      },
    };
  }

  const links = await prisma.link.findUnique({
    where: {
      userId: user.id,
    },
  });

  // user has no links
  if (!links) {
    return {
      props: {
        user: { name: user.name, image: user.image },
        links: [],
      },
    };
  }

  const allLinks = links.links as Array<{
    id: string;
    title: string;
    url: string;
  }>;

  return {
    props: {
      user: { name: user.name, image: user.image },
      links: allLinks.map((link) => {
        return { title: link.title, url: link.url };
      }),
    },
  };
};

export default PublicUserPage;
