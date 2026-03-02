"use client";
import { AppStoreProvider } from "./StoreProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const queryClient = new QueryClient();

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <AppStoreProvider>{children}</AppStoreProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
}
