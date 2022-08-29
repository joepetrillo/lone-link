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

      <main className="flex flex-col gap-10 items-center justify-center min-h-screen text-slate-800 text-lg">
        <h1 className="text-5xl md:text-7xl font-extrabold">Lone Link</h1>

        <div className="h-[100px] flex items-center justify-center flex-col gap-5">
          {status === "loading" ? (
            <Spinner />
          ) : !session ? (
            <>
              <p>You are not signed in</p>
              <Link href="/auth/signin">
                <a className="rounded-lg px-6 py-3 bg-gray-200 hover:bg-gray-300 text-center">
                  Sign In
                </a>
              </Link>
            </>
          ) : (
            <>
              <p>You are signed in as {`${session.user?.email}`}</p>
              <div className="flex gap-5">
                <Link href="/dashboard">
                  <a className="rounded-lg px-6 py-3 bg-gray-200 hover:bg-gray-300 text-center">
                    Dashboard
                  </a>
                </Link>
                <Link href="/auth/signout">
                  <a className="rounded-lg px-6 py-3 bg-gray-200 hover:bg-gray-300 text-center">
                    Sign Out
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="text-center text-lg">
          <div>
            <span>Made by </span>
            <a
              href="https://jpetrillo.com"
              rel="noreferrer"
              target="_blank"
              className="inline-block p-1 pl-0 underline"
            >
              Joseph Petrillo
            </a>
          </div>
          <div>
            <a
              href="https://github.com/joepetrillo"
              rel="noreferrer"
              target="_blank"
              className="inline-block p-1 underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/jpetrillo19"
              rel="noreferrer"
              target="_blank"
              className="inline-block p-1 underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
