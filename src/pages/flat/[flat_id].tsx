import { useRouter } from "next/router";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import Head from "next/head";
import { useEffect, useState } from "react";
import { LoadingPage } from "~/components/loading";

const FlatPage: NextPage = () => {
  const router = useRouter();
  const flat_id = Array.isArray(router.query.flat_id)
    ? Number(router.query.flat_id[0])
    : Number(router.query.flat_id);

  const { data: userFlatData, isLoading } = api.flat.getUserFlatByFlatIdAndContext.useQuery({
    id: flat_id
  });

  useEffect(() => {
    if (router.isReady) {
      const flatIdFromRouter = Number(router.query.flat_id);
      if (isNaN(flatIdFromRouter)) return;

      setFlatId(flatIdFromRouter);

      if (!isLoading && userFlatData && flatIdFromRouter !== userFlatData.flatId) {
        // If the user's flatId does not match the flat_id from the URL, redirect to home
        router.push("/");
      }
    }
  }, [isLoading, userFlatData, router]);

  // Show loading until we have all necessary data and checks
  if (isLoading || !userFlatData || flatId === null || flatId !== userFlatData.flatId) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${userFlatData.flatId} - @${userFlatData.userId}`}</title>
      </Head>
      <div>
        <h1>{`Flatview for: ${userFlatData.flatId} User: ${userFlatData.userId}`}</h1>
      </div>
      <div>
        <h2>{`Flat page: ${flatId}`}</h2>
      </div>
    </>
  );
};

export default FlatPage;
