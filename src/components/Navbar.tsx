import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="flex h-16 w-full flex-row items-center justify-between bg-gray-800 px-4">
      <div className="container mx-auto flex max-w-screen-lg flex-row items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/favicon.ico" className="h-10 w-10" alt="Logo" />
          <p className="hidden text-sm font-medium text-white md:block">
            Flat Flow
          </p>
        </Link>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
