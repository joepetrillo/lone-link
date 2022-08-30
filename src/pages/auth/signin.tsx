import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import Spinner from "../../components/Spinner";
import { env } from "../../env/client.mjs";

const SignIn: NextPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email !== "") {
      signIn("email", {
        email: email,
        callbackUrl: `${env.NEXT_PUBLIC_API_URL}/dashboard`,
      });
      setLoading(true);
    }
  }
  return (
    <div className="min-h-screen flex justify-center items-center px-4 text-lg text-slate-800">
      <div className="bg-slate-50 p-6 rounded-md w-full max-w-screen-sm border-2 border-slate-200">
        <h1 className="text-6xl md:text-7xl font-extrabold text-center mb-10">
          Lone Link
        </h1>

        <div className="min-h-[180px] flex justify-center items-center flex-col gap-5 mb-10">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <p>Enter Your Email Address</p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 justify-center items-center"
              >
                <input
                  className="rounded-md p-3 bg-slate-200 hover:bg-slate-300 placeholder:text-slate-500 focus:bg-slate-300 border-2 border-slate-300"
                  type="email"
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <button className="rounded-md px-6 py-3 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center">
                  Sign In
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
