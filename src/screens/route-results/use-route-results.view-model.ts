import { create } from 'zustand';
import { useAppViewModel } from '../../../AppViewModel';
import busDuration from '../../data/bus-duration.json';
import priceList from '../../data/price-list.json';
import timeSchedule from '../../data/time-schedule.json';
import { RouteData } from '../../types/RouteData';

// 型定義
interface BusDurationData {
  bus_duration: {
    [departure: string]: {
      [arrival: string]: {
        [scheduleType: string]: number;
      };
    };
  };
}

interface PriceListData {
  price_list: {
    [departure: string]: {
      [arrival: string]: {
        [scheduleType: string]: number;
      };
    };
  };
}

interface TimeScheduleData {
  time_schedules: {
    [departure: string]: {
      [arrival: string]: {
        [scheduleType: string]: string[];
      };
    };
  };
}

const busDurationData = busDuration as BusDurationData;
const priceListData = priceList as PriceListData;
const timeScheduleData = timeSchedule as TimeScheduleData;

interface RouteResultsState {
  // Results state
  routeResults: RouteData[];
  departure: string;
  arrival: string;
  currentTimeIndex: number; // 現在表示している時刻のインデックス
  allTimes: string[]; // その日の全ての時刻データ
  searchDateTime: {
    type: 'departure' | 'arrival';
    date: string;
    time: string;
  } | null; // 検索に使用した日時情報

  // Helper functions
  getCurrentScheduleType: () => string;
  getScheduleTypeForDate: (date: string) => string;
  normalizeBusStopName: (name: string) => string;
  generateRouteResults: (baseTimeIndex: number) => RouteData[];

  // Actions
  setRouteResults: (
    results: RouteData[],
    departure: string,
    arrival: string,
    searchDateTime?: { type: 'departure' | 'arrival'; date: string; time: string } | null
  ) => void;
  backToSearch: () => void;
  goToPreviousTime: () => void;
  goToNextTime: () => void;
}

export const useRouteResultsViewModel = create<RouteResultsState>((set, get) => ({
  // Initial state
  routeResults: [],
  departure: '',
  arrival: '',
  currentTimeIndex: 0,
  allTimes: [],
  searchDateTime: null,

  // Helper functions
  getCurrentScheduleType: (): string => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const isSchoolPeriod = !((month === 7 && day >= 20) || month === 8 || 
                            (month === 12 && day >= 25) || (month === 1 && day <= 7) ||
                            (month === 3 && day >= 25) || (month === 4 && day <= 7));

    if (isWeekend) {
      return 'weekendNoSchool';
    } else {
      return isSchoolPeriod ? 'weekdaySchool' : 'weekdayNoSchool';
    }
  },

  normalizeBusStopName: (name: string): string => {
    if (name === 'JR摂津富田') return 'JR富田駅';
    return name;
  },

  getScheduleTypeForDate: (date: string): string => {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();
    const isSchoolPeriod = !((month === 7 && day >= 20) || month === 8 || 
                            (month === 12 && day >= 25) || (month === 1 && day <= 7) ||
                            (month === 3 && day >= 25) || (month === 4 && day <= 7));

    if (isWeekend) {
      return 'weekendNoSchool';
    } else {
      return isSchoolPeriod ? 'weekdaySchool' : 'weekdayNoSchool';
    }
  },

  generateRouteResults: (baseTimeIndex: number) => {
    const state = get();
    const { departure, arrival, allTimes, searchDateTime } = state;
    
    if (allTimes.length === 0) return [];

    const normalizedDeparture = state.normalizeBusStopName(departure);
    const normalizedArrival = state.normalizeBusStopName(arrival);
    const scheduleType = searchDateTime 
      ? state.getScheduleTypeForDate(searchDateTime.date)
      : state.getCurrentScheduleType();

    // 基準時刻から4便分取得
    const startIndex = Math.max(0, baseTimeIndex);
    const endIndex = Math.min(allTimes.length, startIndex + 4);
    const timesToShow = allTimes.slice(startIndex, endIndex);

    return timesToShow.map((time, index) => {
      const [depHour, depMin] = time.split(':').map(Number);
      const departureMinutes = depHour * 60 + depMin;
      
      // 所要時間を取得
      const duration = busDurationData.bus_duration[normalizedDeparture]?.[normalizedArrival]?.[scheduleType] || 0;
      const arrivalMinutes = departureMinutes + duration;
      const arrivalHour = Math.floor(arrivalMinutes / 60) % 24;
      const arrivalMin = arrivalMinutes % 60;
      const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;

      // 料金を取得
      const price = priceListData.price_list[normalizedDeparture]?.[normalizedArrival]?.[scheduleType] || 0;

      // 混雑状況を判定
      const hour = depHour;
      let congestion = '普通';
      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        congestion = '混雑';
      } else if ((hour >= 6 && hour <= 7) || (hour >= 16 && hour <= 17)) {
        congestion = '少し混雑';
      }

      return {
        id: startIndex + index + 1,
        time: `${time}→${arrivalTime}`,
        duration: `${duration}分`,
        price: `${price}円`,
        estimatedCongestion: congestion,
      };
    });
  },

  // Actions
  setRouteResults: (results, departure, arrival, searchDateTime = null) => {
    const state = get();
    const normalizedDeparture = state.normalizeBusStopName(departure);
    const normalizedArrival = state.normalizeBusStopName(arrival);
    const scheduleType = searchDateTime 
      ? state.getScheduleTypeForDate(searchDateTime.date)
      : state.getCurrentScheduleType();

    // 全ての時刻データを取得
    const allTimes = timeScheduleData.time_schedules[normalizedDeparture]?.[normalizedArrival]?.[scheduleType] || [];
    
    // 現在時刻または指定時刻から最初の便のインデックスを計算
    let baseTime: string;
    if (searchDateTime) {
      if (searchDateTime.type === 'departure') {
        baseTime = searchDateTime.time;
      } else { // arrival
        // 到着時刻指定の場合は、所要時間を逆算して出発時刻を計算
        const duration = busDurationData.bus_duration[normalizedDeparture]?.[normalizedArrival]?.[scheduleType] || 0;
        const [arrHour, arrMin] = searchDateTime.time.split(':').map(Number);
        const arrivalMinutes = arrHour * 60 + arrMin;
        const departureMinutes = Math.max(0, arrivalMinutes - duration);
        const depHour = Math.floor(departureMinutes / 60);
        const depMin = departureMinutes % 60;
        baseTime = `${depHour.toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`;
      }
    } else {
      baseTime = new Date().toTimeString().slice(0, 5);
    }
    
    const currentTimeIndex = allTimes.findIndex(time => time >= baseTime);
    const initialIndex = currentTimeIndex >= 0 ? currentTimeIndex : 0;

    set({
      routeResults: results,
      departure,
      arrival,
      allTimes,
      currentTimeIndex: initialIndex,
      searchDateTime,
    });
  },

  backToSearch: () => {
    const { setActiveTab } = useAppViewModel.getState();
    setActiveTab('route');
  },

  goToPreviousTime: () => {
    const state = get();
    const newIndex = Math.max(0, state.currentTimeIndex - 1);
    const newResults = state.generateRouteResults(newIndex);
    
    set({
      currentTimeIndex: newIndex,
      routeResults: newResults,
    });
  },

  goToNextTime: () => {
    const state = get();
    const maxIndex = Math.max(0, state.allTimes.length - 4);
    const newIndex = Math.min(maxIndex, state.currentTimeIndex + 1);
    const newResults = state.generateRouteResults(newIndex);
    
    set({
      currentTimeIndex: newIndex,
      routeResults: newResults,
    });
  },
}));
