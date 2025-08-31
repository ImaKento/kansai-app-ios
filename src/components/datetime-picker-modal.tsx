import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface DateTimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedDateTime: { type: 'departure' | 'arrival', date: string, time: string } | null) => void;
  currentType?: 'departure' | 'arrival';
  resetToCurrentTime?: boolean;
}

const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  currentType = 'departure',
  resetToCurrentTime = false
}) => {
  // 初期値を現在時刻に基づいて設定
  const getCurrentTimeValues = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = Math.floor(now.getMinutes() / 10) * 10;
    const adjustedHour = Math.max(6, Math.min(23, currentHour));
    return { adjustedHour, currentMinute };
  };

  const { adjustedHour: initialHour, currentMinute: initialMinute } = getCurrentTimeValues();

  const [selectedType, setSelectedType] = useState<'departure' | 'arrival'>(currentType);
  const [selectedDateIndex, setSelectedDateIndex] = useState(1); // デフォルトで「今日」を選択（昨日=-1のため今日はインデックス1）
  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);

  // モーダルが開かれる度に現在時刻にリセット
  useEffect(() => {
    if (visible && resetToCurrentTime) {
      const { adjustedHour, currentMinute } = getCurrentTimeValues();
      setSelectedDateIndex(1); // 今日を選択
      setSelectedHour(adjustedHour);
      setSelectedMinute(currentMinute);
      setSelectedType(currentType);
    }
  }, [visible, resetToCurrentTime, currentType]);

  // 日付データを生成
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    // 昨日から7日後まで生成
    for (let i = -1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayName = dayNames[date.getDay()];
      
      let label = `${month}月${day}日 ${dayName}`;
      if (i === 0) label = '今日';
      else if (i === 1) label = '明日';
      
      dates.push({
        label,
        value: `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    return dates;
  };

  const dateOptions = generateDateOptions();
  const hourOptions = Array.from({ length: 18 }, (_, i) => i + 6); // 6時から23時まで
  const minuteOptions = [0, 10, 20, 30, 40, 50];

  // 現在時刻を選択する関数
  const selectCurrentTime = () => {
    // モーダル内の時間も現在時刻に設定
    const { adjustedHour, currentMinute } = getCurrentTimeValues();
    setSelectedDateIndex(1); // 今日を選択
    setSelectedHour(adjustedHour);
    setSelectedMinute(currentMinute);
    
    // 現在時刻で検索する場合は日時指定をクリア
    onConfirm(null);
    onClose();
  };

  const handleConfirm = () => {
    const selectedDate = dateOptions[selectedDateIndex];
    const timeString = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    
    onConfirm({
      type: selectedType,
      date: selectedDate.value,
      time: timeString
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-3">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-500 text-lg">✕</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">時刻選択</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text className="text-blue-500 text-lg font-semibold">完了</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View className="bg-gray-50 px-4 py-2">
          <View className="flex-row bg-white rounded-xl p-1">
            {[
              { key: 'departure' as const, label: '出発' },
              { key: 'arrival' as const, label: '到着' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                className={`flex-1 py-2 px-3 rounded-lg ${selectedType === tab.key ? 'bg-orange-500' : ''}`}
                onPress={() => setSelectedType(tab.key)}
              >
                <Text className={`text-center font-medium ${selectedType === tab.key ? 'text-white' : 'text-gray-600'}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date and Time Picker */}
        <View className="flex-1 flex-row">
          {/* Date Picker */}
          <View className="flex-1 border-r border-gray-200">
            <Text className="text-center py-3 text-gray-600 font-medium bg-gray-50">日付</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {dateOptions.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  className={`py-4 px-4 ${selectedDateIndex === index ? 'bg-blue-50' : ''}`}
                  onPress={() => setSelectedDateIndex(index)}
                >
                  <Text className={`text-center ${selectedDateIndex === index ? 'text-blue-600 font-semibold' : date.isToday ? 'text-orange-600 font-semibold' : 'text-gray-800'}`}>
                    {date.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Time Picker */}
          <View className="flex-1">
            <Text className="text-center py-3 text-gray-600 font-medium bg-gray-50">時刻</Text>
            <View className="flex-1 flex-row">
              {/* Hour Picker */}
              <View className="flex-1 border-r border-gray-100">
                <ScrollView showsVerticalScrollIndicator={false}>
                  {hourOptions.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      className={`py-3 ${selectedHour === hour ? 'bg-blue-50' : ''}`}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text className={`text-center ${selectedHour === hour ? 'text-blue-600 font-semibold' : 'text-gray-800'}`}>
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Minute Picker */}
              <View className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false}>
                  {minuteOptions.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      className={`py-3 ${selectedMinute === minute ? 'bg-blue-50' : ''}`}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text className={`text-center ${selectedMinute === minute ? 'text-blue-600 font-semibold' : 'text-gray-800'}`}>
                        {String(minute).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>

        {/* Current Time Button */}
        <View className="bg-gray-50 px-4 py-3">
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-xl mx-auto"
            onPress={selectCurrentTime}
          >
            <Text className="text-white font-medium text-center">現在時刻を選択</Text>
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <View className="px-4 pb-4">
          <TouchableOpacity
            className="bg-orange-500 py-4 rounded-xl"
            onPress={handleConfirm}
          >
            <Text className="text-white text-center text-lg font-semibold">
              この時刻で検索
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DateTimePickerModal;