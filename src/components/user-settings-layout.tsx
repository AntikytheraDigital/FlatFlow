import React, { type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

interface UserSettingsLayoutProps {
  children: ReactNode;
}

const UserSettingsLayout: React.FC<UserSettingsLayoutProps> = ({
  children,
}) => (
  <>
    <main>{children}</main>
    <Toaster />
  </>
);

export default UserSettingsLayout;
