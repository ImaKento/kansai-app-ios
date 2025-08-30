import { create } from 'zustand';
import { RouteData } from '../../types/RouteData';
import { useAppViewModel } from '../../../AppViewModel';

interface State {
  modalVisible: boolean;
  modalType: 'departure' | 'arrival' | null;
}

interface Actions {
  setModalVisible: (visible: boolean) => void;
  setModalType: (modalType: 'departure' | 'arrival' | null) => void;
  onClick: ({
    departure,
    arrival,
  }: {
    departure: string;
    arrival: string;
  }) => void;
}

export const useRouteSearchViewModel = create<State & Actions>((set, get) => ({
  // Initial state
  modalVisible: false,
  setModalVisible: (visible: boolean) => set({ modalVisible: visible }),
  // モーダルの種類を管理（'departure' | 'arrival' | null）
  modalType: null,
  setModalType: (modalType: 'departure' | 'arrival' | null) =>
    set({ modalType: modalType }),

  onClick: ({ departure, arrival }: { departure: string; arrival: string }) => {
    // Mock search results - in real app this would be API call
    const mockResults: RouteData[] = [
      {
        id: 1,
        time: '18:24→19:16',
        duration: '52分',
        price: '580円',
        transfers: '乗換1回',
        lines: [
          { name: '地下鉄', color: '#9C27B0' },
          { name: 'JR', color: '#2196F3' },
        ],
        route: '東梅田 → 大阪',
      },
      {
        id: 2,
        time: '18:31→19:19',
        duration: '48分',
        price: '1,580円',
        transfers: '乗換1回',
        lines: [{ name: '私鉄', color: '#FF9800' }],
        route: '大王寺',
      },
      {
        id: 3,
        time: '18:24→19:19',
        duration: '55分',
        price: '1,580円',
        transfers: '乗換1回',
        lines: [{ name: '私鉄', color: '#FF9800' }],
        route: '大王寺',
      },
      {
        id: 4,
        time: '18:31→19:29',
        duration: '58分',
        price: '580円',
        transfers: '乗換1回',
        lines: [
          { name: '地下鉄', color: '#9C27B0' },
          { name: 'JR', color: '#2196F3' },
        ],
        route: '東梅田 → 大阪',
      },
    ];

    // Update results ViewModel with search results
    const { setRouteResults } =
      require('../route-results/use-route-results.view-model').useRouteResultsViewModel.getState();
    setRouteResults(mockResults, departure, arrival);

    // Navigate to results screen
    const { setActiveTab } = useAppViewModel.getState();
    setActiveTab('result');
  },
}));
