import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import Spinner from "../../components/Spinner";

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
      <div className="min-h-screen flex flex-col gap-5 justify-center items-center text-lg text-slate-800">
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
      <div className="min-h-screen flex flex-col justify-center items-center text-lg text-slate-800">
        <Spinner />
      </div>
    );
  }
};

export default SignIn;
