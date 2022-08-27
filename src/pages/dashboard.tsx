import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

const Dashboard: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen text-slate-700 text-lg">
      <p>This will be the dashboard page.</p>
      <p>Your username is @{session?.user?.name}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );

  if (session?.user?.name) {
    return {
      props: {
        session: session,
      },
    };
  } else if (session?.user?.name === null || session?.user?.name === "") {
    return {
      redirect: {
        destination: "/auth/setup-profile",
        permanent: false,
      },
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
