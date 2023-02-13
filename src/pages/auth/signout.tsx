import Spinner from "../../components/icons/Spinner";
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
      <h1 className="mb-10 text-center text-6xl font-extrabold md:text-7xl">
        Lone Link
      </h1>

      <div className="mb-10 flex min-h-[180px] flex-col items-center justify-center gap-5">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <p>Are you sure you want to sign out?</p>
            <button
              onClick={handleSubmit}
              className="rounded-md border-2 border-slate-300 bg-slate-200 px-3 py-2 text-center hover:bg-slate-300"
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
