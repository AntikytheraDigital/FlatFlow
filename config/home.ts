import { type HomeConfig } from "types";

export const homeConfig: HomeConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Test",
      href: "/",
      disabled: true,
    },
  ],
  sidebarNav: [],
};
