import type { NextPage } from "next";

const VerifyEmail: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col gap-5 justify-center items-center text-lg text-slate-800">
      <h1 className="text-5xl md:text-7xl font-extrabold">Check Your Email</h1>
      <p>Use the link in the email to sign in!</p>
    </div>
  );
};

export default VerifyEmail;
