import Head from "next/head";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} 
from "@clerk/nextjs";
import { LoadingPage } from "@/components/loading";
import { ModeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { homeConfig } from "config/home";
import { DashboardHeader } from "@/components/header";

const GetCooking = () => {
  return (
    <div className="grid w-full max-w-sm items-center space-x-2">
      <Link href="/dashboard" className={buttonVariants()}>
        Get Cookin&#39;
      </Link>
    </div>
  );
};

export default function Home() {
  const { isLoaded: userIsLoaded, isSignedIn } = useUser();

  if (!userIsLoaded) return <LoadingPage />;
  //if (isSignedIn) return <p>Redirecting...</p>;    // would be good to uncomment when the auth stuff is setup 
  
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
      <div className="flex flex-col items-center">
        <main>
          <div>
            <SignedIn>
              <SignOutButton />
            </SignedIn>
            <SignedOut>
              <div className="mt-20">
                <DashboardHeader heading = "Flat Flow" text = "schedule dinners simply." />
              </div>
              <div className = "mt-10">              
                <GetCooking />
              </div>
            </SignedOut>
          </div>
        </main>
      </div>
    </>
  );
}
