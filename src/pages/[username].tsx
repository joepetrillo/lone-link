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
        <div className="px-4 mt-20 mb-20 mx-auto max-w-screen-md ">
          <div className="flex flex-col items-center justify-center gap-2 mb-10">
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
        <main className="min-h-screen flex flex-col justify-center items-center gap-2">
          <p>This page does not exist</p>
          <p>
            <Link href="/auth/signin" className="underline">
              Sign up
            </Link>{" "}
            to claim it now
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

  if (!user) {
    return {
      props: {
        user,
        links: null,
      },
    };
  }

  const links = await prisma.link.findMany({
    where: {
      userId: user.id,
    },
  });

  return {
    props: {
      user: { name: user.name, image: user.image },
      links: links.map((curr) => {
        return {
          title: curr.title,
          url: curr.url,
        };
      }),
    },
  };
};

export default PublicUserPage;
