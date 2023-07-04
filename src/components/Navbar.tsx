import { SignInButton, SignOutButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const Navbar = () => {
    const { user } = useUser();

    return (
        <div className="flex flex-row justify-between items-center w-full h-16 px-4 bg-gray-800">
            <div className="container max-w-screen-lg mx-auto flex flex-row justify-between items-center">
                <Link href="/" className="flex gap-2 items-center">
                    <img src="/favicon.ico" className="h-10 w-10" alt="Logo" />
                    <p className="hidden text-white text-sm font-medium md:block">Flat Flow</p>
                </Link>
                <SignedOut>
                <SignInButton mode='modal'/>
                </SignedOut>
                <SignedIn>
                <SignOutButton />
                </SignedIn>
            </div>
        </div>
    );
}

export default Navbar;
