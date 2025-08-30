import { create } from 'zustand';
import { RouteData } from '../../types/RouteData';
import { useAppViewModel } from '../../../AppViewModel';

interface RouteResultsState {
  // Results state
  routeResults: RouteData[];
  departure: string;
  arrival: string;
  
  // Actions
  setRouteResults: (results: RouteData[], departure: string, arrival: string) => void;
  backToSearch: () => void;
}

export const useRouteResultsViewModel = create<RouteResultsState>((set) => ({
  // Initial state
  routeResults: [],
  departure: '',
  arrival: '',
  
  // Actions
  setRouteResults: (results, departure, arrival) => set({ 
    routeResults: results,
    departure,
    arrival
  }),
  
  backToSearch: () => {
    const { setActiveTab } = useAppViewModel.getState();
    setActiveTab('route');
  },
}));