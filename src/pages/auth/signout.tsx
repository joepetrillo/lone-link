import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Spinner from "../../components/Spinner";
import { env } from "../../env/client.mjs";

const SignOut: NextPage = () => {
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    signOut({ callbackUrl: `${env.NEXT_PUBLIC_API_URL}` });
    setLoading(true);
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
              <p>Are you sure you want to sign out?</p>
              <button
                onClick={handleSubmit}
                className="rounded-md px-6 py-3 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignOut;
