import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Lone Link</title>
      </Head>

      <main className="flex flex-col gap-10 items-center justify-center min-h-screen text-slate-700 text-lg">
        <h1 className="text-5xl md:text-7xl font-extrabold">Lone Link</h1>

        <div className="h-[100px] flex items-center justify-center flex-col gap-5">
          {status === "loading" ? (
            <svg
              className="animate-spin h-9 w-9 text-slate-700"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
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
