import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouteStore } from '../../store/route-store';
import { useTimetableViewModel } from './use-timetable.view-model';

const TimetableScreen: React.FC = () => {
  const { departure, arrival } = useRouteStore();
  const { timetableData, loading, error, backToSearch, getCurrentScheduleType, selectedDate, getScheduleTypeForDate } = useTimetableViewModel();

  // 日付が指定されている場合はその日付のスケジュールタイプを使用
  const scheduleType = selectedDate ? getScheduleTypeForDate(selectedDate) : getCurrentScheduleType();
  const scheduleTypeLabel = {
    weekdaySchool: '平日（学期中）',
    weekdayNoSchool: '平日（休暇中）',
    weekendNoSchool: '土日祝'
  }[scheduleType];

  // 選択された日付の表示用フォーマット
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const dayName = dayNames[date.getDay()];
    return `${month}月${day}日 (${dayName})`;
  };

  // 現在時刻と比較して過去の時刻かどうか判定
  const isTimeInPast = (timeString: string): boolean => {
    if (!selectedDate) {
      // 日付指定なしの場合は今日との比較
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [hour, minute] = timeString.split(':').map(Number);
      const scheduleTime = hour * 60 + minute;
      return scheduleTime < currentTime;
    } else {
      // 日付指定ありの場合は指定日が今日より前かどうかで判定
      const selectedDateObj = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDateObj.setHours(0, 0, 0, 0);
      
      if (selectedDateObj < today) {
        return true; // 過去の日付は全て過去
      } else if (selectedDateObj > today) {
        return false; // 未来の日付は全て未来
      } else {
        // 今日の場合は時刻で判定
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [hour, minute] = timeString.split(':').map(Number);
        const scheduleTime = hour * 60 + minute;
        return scheduleTime < currentTime;
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white flex-row items-center p-4 border-b border-gray-300">
        <TouchableOpacity className="mr-3" onPress={backToSearch}>
          <Text className="text-xl text-gray-800">←</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">時刻表</Text>
          <Text className="text-sm text-gray-600">
            {departure} → {arrival}
          </Text>
        </View>
      </View>

      {/* Date and Schedule Type Info */}
      <View className="bg-white px-4 py-3 border-b border-gray-300">
        {selectedDate ? (
          <View className="items-center">
            <Text className="text-center text-base font-semibold text-gray-800 mb-1">
              {formatDisplayDate(selectedDate)}
            </Text>
            <Text className="text-center text-sm text-gray-600">
              {scheduleTypeLabel}の時刻表
            </Text>
          </View>
        ) : (
          <Text className="text-center text-sm text-gray-600">
            {scheduleTypeLabel}の時刻表
          </Text>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View className="bg-red-100 border border-red-400 rounded-lg p-3 m-4">
          <Text className="text-red-700 text-center">{error}</Text>
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">読み込み中...</Text>
        </View>
      )}

      {/* Timetable Content */}
      {!loading && !error && timetableData.length > 0 && (
        <ScrollView className="flex-1">
          <View className="p-4">
            <View className="bg-white rounded-lg shadow-sm">
              {/* Time Grid Header */}
              <View className="bg-orange-500 px-4 py-3 rounded-t-lg">
                <Text className="text-white text-center font-semibold">出発時刻</Text>
              </View>

              {/* Time Grid */}
              <View className="p-4">
                {timetableData.map((hourData, hourIndex) => (
                  <View key={hourIndex} className="mb-4">
                    {/* Hour Header */}
                    <View className="flex-row items-center mb-3">
                      <View className="bg-orange-100 px-4 py-2 rounded-full">
                        <Text className="text-orange-700 font-bold text-lg">
                          {hourData.hour}
                        </Text>
                      </View>
                      <View className="flex-1 h-px bg-gray-200 ml-3"></View>
                    </View>

                    {/* Minutes Grid */}
                    <View className="flex-row flex-wrap">
                      {hourData.minutes.map((timeData, timeIndex) => (
                        <View
                          key={timeIndex}
                          className="bg-white border border-gray-200 rounded-lg p-3 m-1 shadow-sm"
                          style={{ minWidth: 100 }}
                        >
                          <View className="items-center">
                            <Text className={`font-bold text-lg ${isTimeInPast(timeData.departureTime) ? 'text-gray-400' : 'text-orange-600'}`}>
                              {timeData.departureTime}
                            </Text>
                            <Text className="text-gray-500 text-xs mt-1">
                              ↓ {timeData.duration}分
                            </Text>
                            <Text className={`text-sm font-medium ${isTimeInPast(timeData.departureTime) ? 'text-gray-400' : 'text-gray-700'}`}>
                              {timeData.arrivalTime}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>

              {/* Footer Info */}
              <View className="bg-gray-50 px-4 py-3 rounded-b-lg border-t border-gray-200">
                <Text className="text-center text-xs text-gray-600">
                  運賃: {timetableData.length > 0 ? timetableData[0].minutes[0]?.price : '---'}円
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* No Data */}
      {!loading && !error && timetableData.length === 0 && (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-600 text-center">
            {departure} → {arrival} の時刻表が見つかりません
          </Text>
        </View>
      )}
    </View>
  );
};

export default TimetableScreen;