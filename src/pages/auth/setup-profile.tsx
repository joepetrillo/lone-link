import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import z from "zod";

const VerifyEmail: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (username === "dashboard" || username === "auth" || username === "api") {
      setError("That username is already taken");
    } else {
      const validUsername = z
        .string()
        .regex(/^[a-z0-9]+$/, {
          message: "Usernames must contain only letters and numbers",
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

      const response = await fetch(
        `http://localhost:3000/api/user/${session?.user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      router.push("/dashboard");
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.currentTarget.value.toLowerCase());
  }

  return (
    <div className="min-h-screen flex flex-col gap-5 justify-center items-center text-lg text-slate-700">
      <h1 className="text-5xl md:text-7xl font-extrabold">Almost Done</h1>
      <form
        className="flex flex-col gap-5 items-center"
        onSubmit={handleSubmit}
      >
        <p>Enter Desired Username</p>
        <div className="rounded-lg p-3 bg-gray-200 border-2 border-slate-700">
          <div className="flex items-center">
            <label htmlFor="username">lone.link/</label>
            <input
              id="username"
              type="text"
              className="bg-transparent outline-none pl-0.5"
              placeholder="username"
              onChange={handleChange}
            />
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button className="rounded-lg px-6 py-3 bg-gray-200 hover:bg-gray-300 text-center">
          Finish
        </button>
      </form>
    </div>
  );
};

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
