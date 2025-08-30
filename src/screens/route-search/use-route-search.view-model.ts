import { create } from 'zustand';
import { RouteData } from '../../types/RouteData';
import { useAppViewModel } from '../../../AppViewModel';

interface RouteSearchState {
  // Form state
  departure: string;
  arrival: string;
  
  // Actions
  setDeparture: (location: string) => void;
  setArrival: (location: string) => void;
  swapLocations: () => void;
  performSearch: () => void;
}

export const useRouteSearchViewModel = create<RouteSearchState>((set, get) => ({
  // Initial state
  departure: '関西大学',
  arrival: 'JR高槻駅北',
  
  // Actions
  setDeparture: (location) => set({ departure: location }),
  setArrival: (location) => set({ arrival: location }),
  
  swapLocations: () => set((state) => ({
    departure: state.arrival,
    arrival: state.departure,
  })),
  
  performSearch: () => {
    // Mock search results - in real app this would be API call
    const mockResults: RouteData[] = [
      {
        id: 1,
        time: "18:24→19:16",
        duration: "52分",
        price: "580円",
        transfers: "乗換1回",
        lines: [
          { name: "地下鉄", color: "#9C27B0" },
          { name: "JR", color: "#2196F3" }
        ],
        route: "東梅田 → 大阪"
      },
      {
        id: 2,
        time: "18:31→19:19",
        duration: "48分",
        price: "1,580円",
        transfers: "乗換1回",
        lines: [
          { name: "私鉄", color: "#FF9800" }
        ],
        route: "大王寺"
      },
      {
        id: 3,
        time: "18:24→19:19",
        duration: "55分",
        price: "1,580円",
        transfers: "乗換1回",
        lines: [
          { name: "私鉄", color: "#FF9800" }
        ],
        route: "大王寺"
      },
      {
        id: 4,
        time: "18:31→19:29",
        duration: "58分",
        price: "580円",
        transfers: "乗換1回",
        lines: [
          { name: "地下鉄", color: "#9C27B0" },
          { name: "JR", color: "#2196F3" }
        ],
        route: "東梅田 → 大阪"
      }
    ];
    
    // Get current form data for search
    const { departure, arrival } = get();
    
    // Update results ViewModel with search results
    const { setRouteResults } = require('../route-results/use-route-results.view-model').useRouteResultsViewModel.getState();
    setRouteResults(mockResults, departure, arrival);
    
    // Navigate to results screen
    const { setActiveTab } = useAppViewModel.getState();
    setActiveTab('result');
  },
}));