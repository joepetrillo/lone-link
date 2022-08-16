import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "./api/auth/[...nextauth]";

const Dashboard: NextPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center text-lg text-slate-700">
      <p>This will be the dashboard page.</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );

  if (session) {
    return {
      props: {}, // will be passed to the page component as props
    };
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default Dashboard;
