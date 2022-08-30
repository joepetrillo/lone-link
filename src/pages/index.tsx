import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Spinner from "../components/Spinner";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Lone Link</title>
      </Head>

      <div className="min-h-screen flex justify-center items-center px-4 text-lg text-slate-800">
        <div className="bg-slate-50 p-6 rounded-md w-full max-w-screen-sm border-2 border-slate-200">
          <h1 className="text-6xl md:text-7xl font-extrabold text-center mb-10">
            Lone Link
          </h1>

          <div className="min-h-[180px] flex justify-center items-center flex-col gap-5 mb-10">
            {status === "loading" ? (
              <Spinner />
            ) : !session ? (
              <>
                <p>You are not signed in</p>
                <Link href="/auth/signin">
                  <a className="rounded-md px-6 py-3 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center">
                    Sign In
                  </a>
                </Link>
              </>
            ) : (
              <>
                <p>You are signed in as {`${session.user?.email}`}</p>
                <div className="flex gap-5">
                  <Link href="/dashboard">
                    <a className="rounded-md px-6 py-3 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center">
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/auth/signout">
                    <a className="rounded-md px-6 py-3 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center">
                      Sign Out
                    </a>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
