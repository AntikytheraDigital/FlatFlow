import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import { getAuth } from "@clerk/nextjs/server";
import { ssgHelper } from "@/server/api/helpers/ssgHelper";

type FlatSettingsPageProps = {
  user_id: string;
};

const FlatSettingsPage: NextPage<FlatSettingsPageProps> = ({ user_id }) => {
  return (
    <>
      <div className="p-4">
        <h1 className="mb-4 text-2xl">User settings view</h1>
      </div>
      <div className="p-4">
        <h1 className="mb-4 text-2xl">User settings for user id: {user_id}</h1>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ssg = await ssgHelper();
  const session = getAuth(ctx.req);

  const userId = ctx.params?.user_id;

  if (userId !== session.userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user_id: ctx.params?.user_id,
    },
  };
};

export default FlatSettingsPage;
