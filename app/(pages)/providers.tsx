// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
// 1. Import your new provider
import { RideTypeStoreProvider } from "@/app/Providers"; 

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* 2. Wrap your children with the provider */}
      <RideTypeStoreProvider>
        {children}
      </RideTypeStoreProvider>
    </SessionProvider>
  );
}