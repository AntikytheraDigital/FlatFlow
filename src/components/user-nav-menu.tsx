import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { type User } from "@clerk/nextjs/dist/types/server/clerkClient";
import { type AvatarProps } from "@radix-ui/react-avatar";
import React from "react";

interface UserNavMenuProps extends AvatarProps {
  user: Pick<User, "firstName" | "profileImageUrl">;
  flatId: string;
}

export function UserAccountNav({ user, flatId }: UserNavMenuProps) {
  // Include flatId in function parameters
  const { signOut, user: currentUser } = useClerk();
  if (!currentUser) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            firstName: user.firstName || null,
            profileImageUrl: user.profileImageUrl,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.firstName && <p className="font-medium">{user.firstName}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/user/settings`}>User Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/flat/settings/${flatId}`}>Flat Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            void signOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
