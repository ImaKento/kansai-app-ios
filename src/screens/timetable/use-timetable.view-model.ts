import { create } from 'zustand';
import { useAppViewModel } from '../../../AppViewModel';
import busDuration from '../../data/bus-duration.json';
import priceList from '../../data/price-list.json';
import timeSchedule from '../../data/time-schedule.json';

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

interface TimeData {
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: string;
}

interface HourData {
  hour: string;
  minutes: TimeData[];
}

interface TimetableState {
  // State
  timetableData: HourData[];
  loading: boolean;
  error: string | null;
  selectedDate: string | null;

  // Actions
  loadTimetable: (departure: string, arrival: string, date?: string) => void;
  backToSearch: () => void;
  getCurrentScheduleType: () => string;
  getScheduleTypeForDate: (date: string) => string;
  normalizeBusStopName: (name: string) => string;
}

export const useTimetableViewModel = create<TimetableState>((set, get) => ({
  // Initial state
  timetableData: [],
  loading: false,
  error: null,
  selectedDate: null,

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

  // Actions
  loadTimetable: (departure: string, arrival: string, date?: string) => {
    set({ loading: true, error: null, selectedDate: date || null });

    try {
      const state = get();
      const normalizedDeparture = state.normalizeBusStopName(departure);
      const normalizedArrival = state.normalizeBusStopName(arrival);
      
      // 日付が指定されている場合はその日付のスケジュールタイプを使用
      const scheduleType = date 
        ? state.getScheduleTypeForDate(date)
        : state.getCurrentScheduleType();

      // データを取得
      const times = timeScheduleData.time_schedules[normalizedDeparture]?.[normalizedArrival]?.[scheduleType] || [];
      const duration = busDurationData.bus_duration[normalizedDeparture]?.[normalizedArrival]?.[scheduleType] || 0;
      const price = priceListData.price_list[normalizedDeparture]?.[normalizedArrival]?.[scheduleType] || 0;

      if (times.length === 0) {
        set({
          error: `${departure} → ${arrival} の時刻表が見つかりません`,
          loading: false,
          timetableData: [],
        });
        return;
      }

      // 時間ごとにグループ化
      const hourGroups: { [hour: string]: TimeData[] } = {};

      times.forEach(time => {
        const [depHour, depMin] = time.split(':').map(Number);
        const departureMinutes = depHour * 60 + depMin;
        const arrivalMinutes = departureMinutes + duration;
        const arrivalHour = Math.floor(arrivalMinutes / 60) % 24;
        const arrivalMin = arrivalMinutes % 60;
        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;

        const hourKey = depHour.toString().padStart(2, '0');
        
        if (!hourGroups[hourKey]) {
          hourGroups[hourKey] = [];
        }

        hourGroups[hourKey].push({
          departureTime: time,
          arrivalTime,
          duration: `${duration}`,
          price: `${price}`,
        });
      });

      // ソートして配列に変換
      const sortedHours = Object.keys(hourGroups)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(hour => ({
          hour: hour + '時',
          minutes: hourGroups[hour].sort((a, b) => a.departureTime.localeCompare(b.departureTime)),
        }));

      set({
        timetableData: sortedHours,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error('時刻表読み込みエラー:', error);
      set({
        error: '時刻表の読み込み中にエラーが発生しました',
        loading: false,
        timetableData: [],
      });
    }
  },

  backToSearch: () => {
    const { setActiveTab } = useAppViewModel.getState();
    setActiveTab('route');
  },
}));