import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

const Navbar = () => {
    const { user } = useUser();

    return (
        <div className="flex flex-row justify-between items-center w-full h-16 px-4 bg-gray-800">
            <div className="container">
                <Link href="/">
                    <a className="flex gap-2 items-center">
                        <img src="/favicon.ico" className="h-8 w-8" alt="Logo" />
                        <p className="hidden text-white text-sm font-bold md:block">Flat Flow</p>
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default Navbar;
