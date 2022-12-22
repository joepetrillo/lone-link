import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import DashboardLink from "../../components/DashboardLink";
import Image from "next/image";
import Link from "next/link";
import NewLinkForm from "../../components/NewLinkForm";
import Spinner from "../../components/Spinner";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

interface DashboardLinkData {
  id: string;
  title: string;
  url: string;
}

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [links, setLinks] = useState<DashboardLinkData[]>([]);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const response = await fetch(`/api/links`);

        const allLinks = await response.json();

        if (!response.ok) {
          setError(allLinks.error);
          return;
        }

        setLinks(allLinks);
      } catch (error) {
        setError("There was an error reaching the server");
      } finally {
        setLoading(false);
      }
    };

    loadLinks();
  }, []);

  return (
    <div className="px-4 mt-20 mb-20 mx-auto max-w-screen-md text-lg text-slate-800">
      <div className="flex justify-between items-center pb-10 mb-10 gap-4 border-b-2 border-slate-300">
        <div className="flex items-center justify-start gap-2">
          <div className="shrink-0">
            <Image
              width={60}
              height={60}
              src={session?.user?.image as string}
              alt="profile picture"
            />
          </div>
          <div className="flex flex-col">
            <span className="break-all">@{session?.user?.name}</span>
            <a
              href={`/${session?.user?.name}`}
              target="_blank"
              className="underline break-all text-slate-500"
              rel="noreferrer"
            >{`lone.link/${session?.user?.name}`}</a>
          </div>
        </div>
        <Link
          href="/auth/signout"
          className="rounded-md px-3 py-2 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center shrink-0"
        >
          Sign Out
        </Link>
      </div>
      <main>
        {error && <p className="text-red-500 mb-5 text-base">{error}</p>}
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div>
            <NewLinkForm
              setError={setError}
              setLinks={setLinks}
              linkCount={links.length}
            />
            {!links.length ? (
              <p className="text-center">You have no links yet!</p>
            ) : (
              links.map(({ id, title, url }) => {
                return (
                  <DashboardLink
                    key={id}
                    id={id}
                    title={title}
                    url={url}
                    setLinks={setLinks}
                  />
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else if (session?.user?.name === null || session?.user?.name === "") {
    return {
      redirect: {
        destination: "/auth/setup-profile",
        permanent: false,
      },
    };
  }

  // get other page props here if I dont want to do client side fetch

  return {
    props: {
      session: session,
    },
  };
};

export default Dashboard;
