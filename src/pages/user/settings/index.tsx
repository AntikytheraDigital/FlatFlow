import { MainNav } from "@/components/main-nav";
import { UserAccountNav } from "@/components/user-nav-menu";
import { UserProfile, useUser } from "@clerk/nextjs";
import { homeConfig } from "config/home";
import React from "react";
import { ssgHelper } from "@/server/api/helpers/ssgHelper";
import { type GetServerSideProps } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { string } from "zod";
import { userSettingsConfig } from "config/usersettings";

export default function UserProfilePage({ flatId }: { flatId: string }) {
  const { user } = useUser();

  if (!user) return null;

  const config = userSettingsConfig(flatId);

  return (
    <>
      <div className="item-center container flex h-16 justify-between py-4">
        <MainNav items={config.mainNav} />
        <UserAccountNav
          user={{
            firstName: user.firstName,
            profileImageUrl: user.profileImageUrl,
          }}
          flatId={flatId}
        />
      </div>
      <div>
        <UserProfile routing="path" path="/user/settings" />;
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ssg = await ssgHelper();
  const session = getAuth(ctx.req);

  if (!session || !session.userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const flatId = await ssg.flat.getSingleFlatIdByUserId.fetch({
    id: session.userId,
  });

  if (typeof flatId !== "string") throw new Error("Users flat id is malformed");

  return {
    props: {
      flatId,
    },
  };
};
