import { create } from 'zustand';

interface State {
  activeTab: string; // 'route' | 'result' | 'timetable'
}

interface Actions {
  setActiveTab: (tab: string) => void;
}

export const useAppViewModel = create<State & Actions>((set) => ({
  activeTab: 'route',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));