import Head from "next/head";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { LoadingPage } from "@/components/loading";
import { ModeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { homeConfig } from "config/home";

// to display the title 'Flat Flow'
const FlatFlow = () => {
  const { user } = useUser();
  return <p>Flat Flow</p>;
};

const GetCooking = () => {
  const { user } = useUser();

  const handleGetCooking = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    // need to put what will happen when button is clicked here I think
  };
  return (
    <div className="grid w-full max-w-sm items-center space-x-2">
      <Link href="/dashboard" className={buttonVariants()}>
        Get Cookin
      </Link>
    </div>
  );
};

export default function Home() {
  const { isLoaded: userIsLoaded, isSignedIn } = useUser();

  if (!userIsLoaded) return <LoadingPage />;
  // if (isSignedIn) return <p>Redirecting...</p>;    // would be good to uncomment when the auth stuff is setup

  return (
    <>
      <Head>
        <title>Flat Flow</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="item-center container flex h-16 justify-between py-4">
        <MainNav items={homeConfig.mainNav} />
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>
      </div>
      <div className="flex min-h-screen flex-col justify-between">
        <main className="flex justify-center">
          <div>
            <SignedIn>
              <SignOutButton />
              <div></div>
              <div></div>
            </SignedIn>
            <SignedOut>
              <div>
                <FlatFlow />
              </div>
              <div>
                <p>schedule dinners simply. </p>
              </div>
              <GetCooking />
            </SignedOut>
          </div>
        </main>
      </div>
    </>
  );
}
