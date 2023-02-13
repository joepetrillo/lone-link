import { FormEvent, useState } from "react";
import Spinner from "../../components/icons/Spinner";
import { signIn } from "next-auth/react";
import { NextPageWithLayout } from "../_app";
import CardLayout from "../../components/CardLayout";

const SignIn: NextPageWithLayout = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email !== "") {
      signIn("email", {
        email: email,
        callbackUrl: `/dashboard`,
      });
      setLoading(true);
    }
  }

  return (
    <>
      <h1 className="mb-10 text-center text-6xl font-extrabold md:text-7xl">
        Lone Link
      </h1>

      <div className="mb-10 flex min-h-[180px] flex-col items-center justify-center gap-5">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <p>Enter Your Email Address</p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center gap-5"
            >
              <input
                className="rounded-md border-2 border-slate-300 bg-slate-200 p-3 placeholder:text-slate-500 hover:bg-slate-300 focus:bg-slate-300"
                type="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.currentTarget.value)}
                value={email}
              />
              <button className="rounded-md border-2 border-slate-300 bg-slate-200 px-3 py-2 text-center hover:bg-slate-300">
                Sign In
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

SignIn.getLayout = (page) => <CardLayout>{page}</CardLayout>;

export default SignIn;
