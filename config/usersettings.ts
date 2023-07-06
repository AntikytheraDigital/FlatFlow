export const userSettingsConfig = (flatId: string) => ({
  mainNav: [
    {
      title: "My Flat",
      href: `/flat/${flatId}`,
    },
  ],
  sidebarNav: [],
});
