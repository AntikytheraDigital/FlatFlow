import Link from "next/link"
import { useUser, useClerk } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"
import { User } from "@clerk/nextjs/dist/types/server/clerkClient";
import { AvatarProps } from "@radix-ui/react-avatar"


interface UserNavMenuProps extends AvatarProps {
    user: Pick<User, "firstName" | "profileImageUrl">
}

export function UserAccountNav({ user }: UserNavMenuProps) {
    const { signOut } = useClerk();
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            user={{ firstName: user.firstName || null, profileImageUrl: user.profileImageUrl}}
            className="h-8 w-8"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.firstName && <p className="font-medium">{user.firstName}</p>}
              {/* {user.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              )} */}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/user/settings/">User Settings</Link> 
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Billing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault()
              signOut()
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
