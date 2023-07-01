import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  type GetServerSidePropsContext,
  InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { createContext } from "vm";
import { createInnerTRPCContext, createTRPCContext } from "~/server/api/trpc";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import Image from "next/image";

type UserProfile = {
  id: string;
  firstName: string | null;
  picture: string;
};

type FlatPageProps = {
  flat_id: number;
  flatmates: UserProfile[];
  userIds: string[];
};

const FlatPage: NextPage<FlatPageProps> = ({ flat_id, flatmates }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Flat view {flat_id}</title>
      </Head>
      <div className="p-4">
        <h1 className="mb-4 text-2xl">Flat view {flat_id}</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {flatmates.map((flatmate) => (
            <div
              key={flatmate.id}
              className="flex flex-col items-center rounded border p-4 shadow-md"
            >
              <Image
                src={flatmate.picture}
                alt={flatmate.firstName ? flatmate.firstName : "First Name"}
                width={100}
                height={100}
                className="rounded-full"
              />
              <h2 className="text-xl">{flatmate.firstName}</h2>
              <p className="text-sm text-gray-600">{flatmate.id}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ flat_id: string }>
) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({}),
    transformer: superjson,
  });

  const session = getAuth(ctx.req);

  //If not authenticated, redirect to the home page
  if (!session || session.userId === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const flat_id = Number(ctx.params?.flat_id);
  const flatMateIds = await ssg.flat.getAllUserIdsInUserFlatByFlatId.fetch({
    id: flat_id,
  });

  //Simple rerouting if the user is not part of the flat
  if (!flatMateIds.includes(session.userId)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const flatmates: UserProfile[] = await Promise.all(
    flatMateIds.map(async (id: string) => {
      const user = await ssg.profile.getUserById.fetch({ id });
      return {
        id: user.id,
        firstName: user.firstName,
        picture: user.profileImageUrl,
      };
    })
  );

  return {
    props: {
      trpcState: ssg.dehydrate(),
      flat_id,
      flatmates,
    },
  };
};

export default FlatPage;
