import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Spinner from "../../components/Spinner";

const SignOut: NextPage = () => {
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    signOut({ callbackUrl: "http://localhost:3000" });
    setLoading(true);
  }

  if (loading === false) {
    return (
      <div className="min-h-screen flex flex-col gap-5 justify-center items-center text-lg text-slate-800">
        <p>Are you sure you want to sign out?</p>
        <button
          className="rounded-lg px-6 py-3 bg-gray-200 hover:bg-gray-300 text-center"
          onClick={handleSubmit}
        >
          Sign Out
        </button>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-lg text-slate-800">
        <Spinner />
      </div>
    );
  }
};

export default SignOut;
