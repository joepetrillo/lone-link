import { ReactElement } from "react";
import CardLayout from "../../components/CardLayout";
import { NextPageWithLayout } from "../_app";

const VerifyEmail: NextPageWithLayout = () => {
  return (
    <>
      <div className="flex justify-center items-center flex-col gap-5 mt-10 mb-10">
        <h1 className="text-6xl md:text-7xl font-extrabold text-center">
          Check Your Email
        </h1>
        <p className="text-center">
          Click the link we sent to finish signing in
        </p>
      </div>
    </>
  );
};

VerifyEmail.getLayout = function getLayout(page: ReactElement) {
  return <CardLayout>{page}</CardLayout>;
};

export default VerifyEmail;
