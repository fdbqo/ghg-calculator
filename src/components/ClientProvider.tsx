"use client";

import { EmissionsProvider } from "@/context/EmissionsContext";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return <EmissionsProvider>{children}</EmissionsProvider>;
}
