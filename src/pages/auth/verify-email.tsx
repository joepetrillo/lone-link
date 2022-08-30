import type { NextPage } from "next";

const VerifyEmail: NextPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center px-4 text-lg text-slate-800">
      <div className="bg-slate-50 p-6 rounded-md w-full max-w-screen-sm border-2 border-slate-200">
        <div className="flex justify-center items-center flex-col gap-5 mt-10 mb-10">
          <h1 className="text-6xl md:text-7xl font-extrabold text-center">
            Check Your Email
          </h1>
          <p className="text-center">
            Click the link we sent to finish signing in
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
