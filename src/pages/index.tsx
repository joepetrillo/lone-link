import Head from "next/head";
import Link from "next/link";
import Spinner from "../components/icons/Spinner";
import { useSession } from "next-auth/react";
import { NextPageWithLayout } from "./_app";
import CardLayout from "../components/CardLayout";

const Home: NextPageWithLayout = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Lone Link</title>
      </Head>

      <h1 className="mb-10 text-center text-6xl font-extrabold md:text-7xl">
        Lone Link
      </h1>

      <div className="mb-10 flex min-h-[180px] flex-col items-center justify-center gap-5">
        {status === "loading" ? (
          <Spinner />
        ) : !session ? (
          <>
            <p>You are not signed in</p>
            <Link
              href="/auth/signin"
              className="rounded-md border-2 border-slate-300 bg-slate-200 px-3 py-2 text-center hover:bg-slate-300"
            >
              Sign In
            </Link>
          </>
        ) : (
          <>
            <p className="text-center">
              You are signed in as {`${session.user?.email}`}
            </p>
            <div className="flex gap-5">
              <Link
                href="/dashboard"
                className="rounded-md border-2 border-slate-300 bg-slate-200 px-3 py-2 text-center hover:bg-slate-300"
              >
                Dashboard
              </Link>
              <Link
                href="/auth/signout"
                className="rounded-md border-2 border-slate-300 bg-slate-200 px-3 py-2 text-center hover:bg-slate-300"
              >
                Sign Out
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

Home.getLayout = (page) => <CardLayout>{page}</CardLayout>;

export default Home;
