import { type NextPage, type GetServerSideProps } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { ssgHelper } from "@/server/api/helpers/ssgHelper";
import { prisma } from "@/server/db";
import { MainNav } from "@/components/main-nav";
import { UserAccountNav } from "@/components/user-nav-menu";
import { useUser } from "@clerk/nextjs";
import { userSettingsConfig } from "config/usersettings";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { FlatSettingsForm } from "@/components/flat-settings-form";

type UserProfile = {
  id: string;
  firstName: string | null;
  picture: string;
};

type FlatSettingsPageProps = {
  flat_id: string;
  flatmates: UserProfile[];
};

const FlatSettingsPage: NextPage<FlatSettingsPageProps> = ({
  flat_id,
  flatmates,
}) => {
  const { user } = useUser();

  if (!user) return null;

  const config = userSettingsConfig(flat_id);

  return (
    <>
      <div className="item-center container flex h-16 justify-between py-4">
        <MainNav items={config.mainNav} />
        <UserAccountNav
          user={{
            firstName: user.firstName,
            profileImageUrl: user.profileImageUrl,
          }}
          flatId={flat_id}
        />
      </div>
      <div className="p-4">
        <h1 className="mb-4 text-2xl">Flat settings for flat id: {flat_id}</h1>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Flat Settings</h3>
          <p className="text-sm text-muted-foreground">
            This is will affect how you flat is displayed and how your schedule
            works.
          </p>
        </div>
        <Separator />
        <FlatSettingsForm flatmates={flatmates} />
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
  if (!flat || typeof flatId !== "string" || !session.userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const flatMateIds = await ssg.flat.getAllUserIdsInUserFlatByFlatId.fetch({
    id: flatId,
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
      flat_id: flatId,
      flatmates,
    },
  };
};

export default FlatSettingsPage;
