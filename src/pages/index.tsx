import Head from "next/head";
import { api } from "@/utils/api";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { LoadingPage, LoadingSpinner } from "@/components/loading";
import { useState } from "react";
import { ModeToggle } from "@/components/theme-toggle";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import Link from "next/link";




// to display the title 'Flat Flow' 
const FlatFlow = () => {
  const {user} = useUser();
  return <p>Flat Flow</p>
}

const GetCooking = () => {
  const {user} = useUser();

  const handleGetCooking = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    // need to put what will happen when button is clicked here I think 

  }
  return (
    <div className="grid w-full max-w-sm items-center space-x-2" >
      <Link href = '/dashboard' className = {buttonVariants()}>
        Get Cookin
      </Link>
    </div>
  );
}

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
      <div className="flex flex-col min-h-screen justify-between">
        <main className="flex justify-center">
          <div>
            <SignedIn>
              <SignOutButton />
              <div>
                </div>
              <div>
                </div>
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
        <footer>
          <ModeToggle />
        </footer>
      </div>
    </>
  );
}
