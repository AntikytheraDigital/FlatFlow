import type { NextPage} from "next";
import Head from "next/head";
import { api } from "~/utils/api"
const FlatPage: NextPage<{ id: number }> = ({ id }) => {
    const { data } = api.flat.getUserFlatByUserId.useQuery();
    if (!data) return <div>404</div>;

    return (
      <>
        <Head>
          <title>{`${data.flatId} - @${data.userId}`}</title>
        </Head>
        <body>
          <h1>{`Flatview for:${data.flatId} User:${data.userId}`}</h1>
        </body>
      </>
    );
  };
  export default FlatPage;