"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type RideTypeStore,
  createRideTypeStore,
} from "@/state/counter-store";

export type RideTypeStoreApi = ReturnType<typeof createRideTypeStore>;

export const RideTypeStoreContext = createContext<RideTypeStoreApi | undefined>(
  undefined
);

export interface RideTypeStoreProviderProps {
  children: ReactNode;
  initialRideType?: "One Way" | "Round Trip" | "Local";
}

export const RideTypeStoreProvider = ({
  children,
  initialRideType = "One Way",
}: RideTypeStoreProviderProps) => {
  const storeRef = useRef<RideTypeStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createRideTypeStore({ rideType: initialRideType });
  }

  return (
    <RideTypeStoreContext.Provider value={storeRef.current}>
      {children}
    </RideTypeStoreContext.Provider>
  );
};

export const useRideTypeStore = <T,>(
  selector: (store: RideTypeStore) => T
): T => {
  const rideTypeStoreContext = useContext(RideTypeStoreContext);

  if (!rideTypeStoreContext) {
    throw new Error(
      `useRideTypeStore must be used within RideTypeStoreProvider`
    );
  }

  return useStore(rideTypeStoreContext, selector);
};
