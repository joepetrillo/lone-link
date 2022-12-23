import { FormEvent, useState } from "react";
import Spinner from "../../components/Spinner";
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
              <button className="rounded-md px-3 py-2 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center">
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
