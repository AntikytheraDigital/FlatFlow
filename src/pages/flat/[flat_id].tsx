import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { api } from '~/utils/api';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { LoadingPage } from '~/components/loading';

const FlatPage: NextPage = () => {
  const router = useRouter();
  //flat_id is a string. needs to be converted to number for prisma query
  const flat_id = Array.isArray(router.query.flat_id)
    ? Number(router.query.flat_id[0])
    : Number(router.query.flat_id);

  const { data: userFlatData, isLoading } = api.flat.getUserFlatByFlatIdAndContext.useQuery({
    id: flat_id
  });

  useEffect(() => {
    if (!isLoading && (!userFlatData || flat_id !== userFlatData.flatId)) {
      // If the user doesn't have a flatId, or if the user's flatId does not match the flat_id from the URL, redirect to home
      router.push("/");
    }
  }, [isLoading, userFlatData, flat_id, router]);
  

  if (isLoading || isNaN(flat_id)) {
    return <div>
      <LoadingPage />
    </div>;
  }

  if (!userFlatData) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>{`${userFlatData.flatId} - @${userFlatData.userId}`}</title>
      </Head>
      <div>
        <h1>{`Flatview for user belonging to: ${userFlatData.flatId} User: ${userFlatData.userId}`}</h1>
      </div>
      <div>
        <h2>{`Flat page view for flatid: ${flat_id}`}</h2>
        </div>
    </>
  );
};

export default FlatPage;
