import Spinner from "../../components/Spinner";
import { signOut } from "next-auth/react";
import { useState } from "react";
import CardLayout from "../../components/CardLayout";
import { NextPageWithLayout } from "../_app";

const SignOut: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    signOut({ callbackUrl: `/` });
    setLoading(true);
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
            <p>Are you sure you want to sign out?</p>
            <button
              onClick={handleSubmit}
              className="rounded-md px-3 py-2 bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-center"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </>
  );
};

SignOut.getLayout = (page) => <CardLayout>{page}</CardLayout>;

export default SignOut;
