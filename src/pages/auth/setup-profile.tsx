import { FormEvent, useState } from "react";
import type { GetServerSideProps } from "next";
import Spinner from "../../components/Spinner";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";
import z from "zod";
import { NextPageWithLayout } from "../_app";
import CardLayout from "../../components/CardLayout";

const VerifyEmail: NextPageWithLayout = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (username === "dashboard" || username === "auth" || username === "api") {
      setError("That username is already taken");
    } else {
      const validUsername = z
        .string()
        .regex(/^[a-z0-9]+$/, {
          message: "Usernames must contain only lowercase letters and numbers",
        })
        .min(3, { message: "Usernames must be at least 3 characters" })
        .max(20, { message: "Usernames cannot be more than 20 characters" });

      const validation = validUsername.safeParse(username);

      if (!validation.success) {
        setError(validation.error.issues[0]?.message);
        return;
      }

      // if we make it here, we have a valid username syntax!
      // now we must attempt to update the username on the server, but the username might already be taken

      try {
        setLoading(true);
        const response = await fetch(`/api/profile`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
          setLoading(false);
          return;
        }

        // trigger new session refresh (IMPORTANT) and go to dashboard
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
        router.push("/dashboard");
      } catch (error) {
        setError("There was an error reaching the server");
        setLoading(false);
      }
    }

    // const result = await getSession({
    //   broadcast: true,
    //   event: "storage",
    //   triggerEvent: true,
    // });
  }

  return (
    <>
      <h1 className="text-6xl md:text-7xl font-extrabold text-center mb-10">
        Almost Done
      </h1>

      <div className="min-h-[180px] flex justify-center items-center flex-col gap-5 mb-10">
        {error && <p className="text-red-500 text-center text-base">{error}</p>}
        {loading ? (
          <Spinner />
        ) : (
          <>
            <p>Enter Desired Username</p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 justify-center items-center"
            >
              <div className="rounded-md p-3 bg-slate-200 border-2 border-slate-300 max-w-[278.33px]">
                <div className="flex items-center">
                  <label htmlFor="username">lone.link/</label>
                  <input
                    id="username"
                    type="text"
                    className="w-full bg-transparent rounded-md outline-none ml-0.5 pl-0.5 bg-slate-200 hover:bg-slate-300 placeholder:text-slate-500 focus:bg-slate-300"
                    placeholder="username"
                    onChange={(e) =>
                      setUsername(e.currentTarget.value.toLowerCase())
                    }
                  />
                </div>
              </div>
              <button className="rounded-md px-3 py-2 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center">
                Finish
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

VerifyEmail.getLayout = (page) => <CardLayout>{page}</CardLayout>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );

  if (session?.user?.name !== null && session?.user?.name !== "") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session: session,
      },
    };
  }
};

export default VerifyEmail;
