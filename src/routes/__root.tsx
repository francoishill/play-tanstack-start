/// <reference types="vite/client" />
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { LoadingPage } from "~/components/LoadingPage";
import { useMantineLoaded } from "~/hooks/useMantineLoaded";
import appCss from "~/styles/app.css?url";

const queryClient = new QueryClient();

const theme = createTheme({
  /** Put your mantine theme override here */
});

//TODO: is this solution fine to remove the console errors?
// Suppress React 19 style precedence warnings from Mantine
// These are harmless and will be fixed in a future Mantine update
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Cannot render a <style> outside the main document")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
    ],
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#228be6" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Play Tanstack Start" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const isMantineLoaded = useMantineLoaded();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <RootDocument>
          {isMantineLoaded ? <Outlet /> : <LoadingPage />}
        </RootDocument>

        <Notifications position="bottom-right" />
      </MantineProvider>
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
