import { type FlatConfig } from "types";

export const flatConfig: FlatConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/",
    },
    {
      title: "Support",
      href: "/",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Posts",
      href: "/",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/",
      icon: "settings",
    },
  ],
};
