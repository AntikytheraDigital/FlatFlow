import { AvatarProps } from "@radix-ui/react-avatar"
import { User } from '@clerk/clerk-sdk-node'; 

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "firstName" | "profileImageUrl">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.profileImageUrl ? (
        <AvatarImage alt="Picture" src={user.profileImageUrl} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.profileImageUrl}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
