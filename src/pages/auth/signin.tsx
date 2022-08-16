import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";

const SignIn: NextPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email !== "") {
      signIn("email", {
        email: email,
        callbackUrl: "http://localhost:3000/dashboard",
      });
      setLoading(true);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  if (loading === false) {
    return (
      <div className="min-h-screen flex flex-col gap-5 justify-center items-center text-lg text-slate-700">
        <form
          className="flex flex-col gap-5 items-center"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-3 items-center">
            <span>Enter Your Email</span>
            <input
              className="rounded-lg p-3 bg-gray-200 text-center border-2 border-slate-700"
              type="email"
              placeholder="email address"
              onChange={handleChange}
            />
          </label>
          <button className="rounded-lg px-6 py-3 bg-gray-200 hover:bg-gray-300 text-center">
            Sign In
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-lg text-slate-700">
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
      </div>
    );
  }
};

export default SignIn;
