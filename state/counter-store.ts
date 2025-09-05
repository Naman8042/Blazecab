import { createStore } from "zustand/vanilla";

// ---- Types ----
export type RideType = "One Way" | "Round Trip" | "Local";


export type RideTypeState = {
  rideType: RideType;
};

export type RideTypeActions = {
  setRideType: (value: RideType) => void;
};

export type RideTypeStore = RideTypeState & RideTypeActions;

export const defaultInitState: RideTypeState = {
  rideType: "One Way",
};

// ---- Store Factory ----
export const createRideTypeStore = (
  initState: RideTypeState = defaultInitState
) => {
  return createStore<RideTypeStore>()((set) => ({
    ...initState,
    setRideType: (value) => set(() => ({ rideType: value })),
  }));
};
