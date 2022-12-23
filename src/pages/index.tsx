import Head from "next/head";
import Link from "next/link";
import Spinner from "../components/Spinner";
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

      <h1 className="text-6xl md:text-7xl font-extrabold text-center mb-10">
        Lone Link
      </h1>

      <div className="min-h-[180px] flex justify-center items-center flex-col gap-5 mb-10">
        {status === "loading" ? (
          <Spinner />
        ) : !session ? (
          <>
            <p>You are not signed in</p>
            <Link
              href="/auth/signin"
              className="rounded-md px-3 py-2 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center"
            >
              Sign In
            </Link>
          </>
        ) : (
          <>
            <p>You are signed in as {`${session.user?.email}`}</p>
            <div className="flex gap-5">
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center"
              >
                Dashboard
              </Link>
              <Link
                href="/auth/signout"
                className="rounded-md px-3 py-2 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center"
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
