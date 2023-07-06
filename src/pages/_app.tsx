import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/global.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";
import { dark } from "@clerk/themes";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            layout: {
              logoPlacement: "inside",
            },
          }}
        >
          <Component {...pageProps} />
        </ClerkProvider>
      </ThemeProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
