import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "../../components/Spinner";
import DashboardLink from "../../components/DashboardLink";
import NewLinkForm from "../../components/NewLinkForm";

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
      // get all links from server that the logged in user owns
      const response = await fetch(`http://localhost:3000/api/links`);

      if (response.ok) {
        const data = await response.json();
        setLinks(data);
        setLoading(false);
      } else {
        setError("There was an error retrieving your links");
        setLoading(false);
      }
    };

    loadLinks();
  }, []);

  return (
    <div className="px-4 mt-20 mb-20 mx-auto max-w-screen-md text-lg text-slate-800">
      <div className="flex items-center justify-center gap-2 mb-10">
        <Image
          width={65}
          height={65}
          src={session?.user?.image as string}
          alt="profile picture"
        />
        <div className="flex flex-col">
          <span>@{session?.user?.name}</span>
          <a
            href={`/${session?.user?.name}`}
            target="_blank"
            className="underline"
            rel="noreferrer"
          >{`lone.link/${session?.user?.name}`}</a>
        </div>
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
            {links.map(({ id, title, url }) => {
              return (
                <DashboardLink
                  key={id}
                  id={id}
                  title={title}
                  url={url}
                  setLinks={setLinks}
                />
              );
            })}
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
