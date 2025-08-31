// 1. 型定義の修正
interface BusDurationData {
  bus_duration: {
    [departure: string]: {
      [arrival: string]: {
        [scheduleType: string]: number; // 分単位
      };
    };
  };
}

interface PriceListData {
  price_list: {
    [departure: string]: {
      [arrival: string]: {
        [scheduleType: string]: number; // 円単位
      };
    };
  };
}

interface TimeScheduleData {
  time_schedules: {
    [departure: string]: {
      [arrival: string]: {
        [scheduleType: string]: string[]; // "HH:mm"形式
      };
    };
  };
}

// 2. 修正されたViewModel
import { create } from 'zustand';
import { useAppViewModel } from '../../../AppViewModel';
import busDuration from '../../data/bus-duration.json';
import priceList from '../../data/price-list.json';
import timeSchedule from '../../data/time-schedule.json';
import { RouteData } from '../../types/RouteData';
import { useRouteResultsViewModel } from '../route-results/use-route-results.view-model';
import { useTimetableViewModel } from '../timetable/use-timetable.view-model';

// 型アサーション（JSONインポート用）
const busDurationData = busDuration as BusDurationData;
const priceListData = priceList as PriceListData;
const timeScheduleData = timeSchedule as TimeScheduleData;

interface State {
  modalVisible: boolean;
  modalType: 'departure' | 'arrival' | null;
  loading: boolean;
  error: string | null;
  dateTimePickerVisible: boolean;
  selectedDateTime: {
    type: 'departure' | 'arrival';
    date: string;
    time: string;
  } | null;
}

interface Actions {
  setModalVisible: (visible: boolean) => void;
  setModalType: (modalType: 'departure' | 'arrival' | null) => void;
  onClick: (params: { departure: string; arrival: string }) => void;
  onTimetableSearch: (params: { departure: string; arrival: string }) => void;
  clearError: () => void;
  setDateTimePickerVisible: (visible: boolean) => void;
  setSelectedDateTime: (dateTime: { type: 'departure' | 'arrival'; date: string; time: string } | null) => void;
  getCurrentScheduleType: () => string;
  getRouteInfo: (departure: string, arrival: string, date?: string) => {
    duration: number | null;
    times: string[];
    price: number | null;
  };
  getScheduleTypeForDate: (date: string) => string;
}

export const useRouteSearchViewModel = create<State & Actions>((set, get) => ({
  // Initial state
  modalVisible: false,
  modalType: null,
  loading: false,
  error: null,
  dateTimePickerVisible: false,
  selectedDateTime: null,

  // Actions
  setModalVisible: (visible: boolean) => set({ modalVisible: visible }),
  setModalType: (modalType: 'departure' | 'arrival' | null) => set({ modalType }),
  clearError: () => set({ error: null }),
  setDateTimePickerVisible: (visible: boolean) => set({ dateTimePickerVisible: visible }),
  setSelectedDateTime: (dateTime: { type: 'departure' | 'arrival'; date: string; time: string } | null) => 
    set({ selectedDateTime: dateTime }),

  // 現在のスケジュールタイプを取得
  getCurrentScheduleType: (): string => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // 簡易的な学期判定
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

  // 指定した日付のスケジュールタイプを取得
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

  // 路線情報を安全に取得
  getRouteInfo: (departure: string, arrival: string, date?: string) => {
    const state = get();
    const scheduleType = date 
      ? state.getScheduleTypeForDate(date)
      : state.getCurrentScheduleType();
    
    try {
      const duration = busDurationData.bus_duration[departure]?.[arrival]?.[scheduleType] || null;
      const times = timeScheduleData.time_schedules[departure]?.[arrival]?.[scheduleType] || [];
      const price = priceListData.price_list[departure]?.[arrival]?.[scheduleType] || null;
      
      return { duration, times, price };
    } catch (error) {
      console.error('路線情報取得エラー:', error);
      return { duration: null, times: [], price: null };
    }
  },

  onClick: ({ departure, arrival }: { departure: string; arrival: string }) => {
    set({ loading: true, error: null });
    
    try {
      const state = get();
      const { selectedDateTime } = state;
      
      // 日時指定がある場合はその日付のスケジュールタイプを使用
      const scheduleType = selectedDateTime 
        ? state.getScheduleTypeForDate(selectedDateTime.date)
        : state.getCurrentScheduleType();
      
      // バス停名を正規化（JR摂津富田 → JR富田駅）
      const normalizeBusStopName = (name: string): string => {
        if (name === 'JR摂津富田') return 'JR富田駅';
        return name;
      };

      const normalizedDeparture = normalizeBusStopName(departure);
      const normalizedArrival = normalizeBusStopName(arrival);
      
      const routeInfo = get().getRouteInfo(
        normalizedDeparture, 
        normalizedArrival, 
        selectedDateTime?.date
      );
      
      console.log('検索条件:', { 
        departure: normalizedDeparture, 
        arrival: normalizedArrival, 
        scheduleType,
        selectedDateTime,
        routeInfo 
      });
      
      // データが存在するかチェック
      if (routeInfo.times.length === 0) {
        set({ 
          error: `${departure} → ${arrival} の路線が見つかりません。`,
          loading: false 
        });
        return;
      }

      // 基準時刻を決定（日時指定がある場合はその時刻、ない場合は現在時刻）
      let baseTime: string;
      if (selectedDateTime) {
        if (selectedDateTime.type === 'departure') {
          baseTime = selectedDateTime.time;
        } else { // arrival
          // 到着時刻指定の場合は、所要時間を逆算して出発時刻を計算
          const [arrHour, arrMin] = selectedDateTime.time.split(':').map(Number);
          const arrivalMinutes = arrHour * 60 + arrMin;
          const departureMinutes = Math.max(0, arrivalMinutes - (routeInfo.duration || 0));
          const depHour = Math.floor(departureMinutes / 60);
          const depMin = departureMinutes % 60;
          baseTime = `${depHour.toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`;
        }
      } else {
        baseTime = new Date().toTimeString().slice(0, 5);
      }

      const upcomingTimes = routeInfo.times
        .filter(time => time >= baseTime)
        .slice(0, 4); // 最大4便
      
      // 基準時刻のインデックスを計算
      const baseTimeIndex = routeInfo.times.findIndex(time => time >= baseTime);
      const actualBaseIndex = baseTimeIndex >= 0 ? baseTimeIndex : 0;
      
      if (upcomingTimes.length === 0) {
        // 翌日の最初の4便を表示
        const tomorrowTimes = routeInfo.times.slice(0, 4); // 最大4便
        if (tomorrowTimes.length > 0) {
          const tomorrowResults: RouteData[] = tomorrowTimes.map((time, index) => {
            const [depHour, depMin] = time.split(':').map(Number);
            const departureMinutes = depHour * 60 + depMin;
            const arrivalMinutes = departureMinutes + (routeInfo.duration || 0);
            const arrivalHour = Math.floor(arrivalMinutes / 60) % 24;
            const arrivalMin = arrivalMinutes % 60;
            const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;

            // 混雑状況を時間帯で判定
            const hour = depHour;
            let congestion = '普通';
            if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
              congestion = '混雑';
            } else if ((hour >= 6 && hour <= 7) || (hour >= 16 && hour <= 17)) {
              congestion = '少し混雑';
            }

            return {
              id: index + 1,
              time: `${time}→${arrivalTime} (翌日)`,
              duration: `${routeInfo.duration || 0}分`,
              price: `${routeInfo.price || 0}円`,
              estimatedCongestion: congestion,
            };
          });

          const { setRouteResults } = useRouteResultsViewModel.getState();
          setRouteResults(tomorrowResults, departure, arrival, selectedDateTime);

          const { setActiveTab } = useAppViewModel.getState();
          setActiveTab('result');
          
          set({ loading: false });
          return;
        }
        
        set({ 
          error: '本日の運行は終了しました',
          loading: false 
        });
        return;
      }

      // 検索結果を作成
      const searchResults: RouteData[] = upcomingTimes.map((time, index) => {
        const [depHour, depMin] = time.split(':').map(Number);
        const departureMinutes = depHour * 60 + depMin;
        const arrivalMinutes = departureMinutes + (routeInfo.duration || 0);
        const arrivalHour = Math.floor(arrivalMinutes / 60) % 24;
        const arrivalMin = arrivalMinutes % 60;
        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;

        // 混雑状況を時間帯で判定
        const hour = depHour;
        let congestion = '普通';
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
          congestion = '混雑';
        } else if ((hour >= 6 && hour <= 7) || (hour >= 16 && hour <= 17)) {
          congestion = '少し混雑';
        }

        return {
          id: actualBaseIndex + index + 1,
          time: `${time}→${arrivalTime}`,
          duration: `${routeInfo.duration || 0}分`,
          price: `${routeInfo.price || 0}円`,
          estimatedCongestion: congestion,
        };
      });

      // 結果をセット（日時指定情報も一緒に渡す）
      const { setRouteResults } = useRouteResultsViewModel.getState();
      setRouteResults(searchResults, departure, arrival, selectedDateTime);

      // 結果画面に遷移
      const { setActiveTab } = useAppViewModel.getState();
      setActiveTab('result');

    } catch (error) {
      console.error('検索エラー:', error);
      set({ 
        error: '検索中にエラーが発生しました',
        loading: false 
      });
    } finally {
      set({ loading: false });
    }
  },

  onTimetableSearch: ({ departure, arrival }: { departure: string; arrival: string }) => {
    set({ loading: true, error: null });
    
    try {
      const state = get();
      const { selectedDateTime } = state;
      
      // 時刻表画面に遷移してデータをロード（日時指定がある場合はその日付を渡す）
      const { loadTimetable } = useTimetableViewModel.getState();
      if (selectedDateTime) {
        loadTimetable(departure, arrival, selectedDateTime.date);
      } else {
        loadTimetable(departure, arrival);
      }

      // 時刻表画面に遷移
      const { setActiveTab } = useAppViewModel.getState();
      setActiveTab('timetable');

    } catch (error) {
      console.error('時刻表検索エラー:', error);
      set({ 
        error: '時刻表検索中にエラーが発生しました',
        loading: false 
      });
    } finally {
      set({ loading: false });
    }
  },
}));
