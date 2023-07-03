import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import { getAuth } from "@clerk/nextjs/server";
import { ssgHelper } from "@/server/api/helpers/ssgHelper";
import { prisma } from "@/server/db";

type FlatSettingsPageProps = {
  flat_id: string;
};

const FlatSettingsPage: NextPage<FlatSettingsPageProps> = ({ flat_id }) => {
  return (
    <>
      <div className="p-4">
        <h1 className="mb-4 text-2xl">Flat settings for flat id: {flat_id}</h1>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ssg = await ssgHelper();
  const session = getAuth(ctx.req);

  const flatId = Array.isArray(ctx.params?.flat_id)
    ? ctx.params?.flat_id[0]
    : ctx.params?.flat_id;

  // Fetch flat with the provided flatId
  const flat = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
  });

  // If the flat does not exist, redirect the user.
  if (!flat) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      flat_id: flatId,
    },
  };
};

export default FlatSettingsPage;
