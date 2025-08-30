import { create } from 'zustand';

interface State {
  departure: string;
  arrival: string;
}

interface Actions {
  setDeparture: (departure: string) => void;
  setArrival: (arrival: string) => void;
  swapLocations: (departure: string, arrival: string) => void;
}

export const useRouteStore = create<State & Actions>(set => ({
  departure: '関西大学',
  arrival: 'JR高槻駅北',

  setDeparture: departure => set({ departure }),
  setArrival: arrival => set({ arrival }),
  swapLocations: (departure, arrival) =>
    set({ arrival: departure, departure: arrival }),
}));
