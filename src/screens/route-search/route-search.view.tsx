import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from '../../components/datetime-picker-modal';
import ScrollableSelectionModal from '../../components/scrollable-list-modal';
import { useRouteStore } from '../../store/route-store';
import { useRouteSearchViewModel } from './use-route-search.view-model';

interface Option {
  id: number;
  label: string;
}

const RouteSearchScreen: React.FC = () => {
  const { departure, arrival, setDeparture, setArrival, swapLocations } =
    useRouteStore();
  const { 
    modalVisible, modalType, setModalType, setModalVisible, 
    onClick, onTimetableSearch, loading, error, clearError,
    dateTimePickerVisible, setDateTimePickerVisible, selectedDateTime, setSelectedDateTime 
  } = useRouteSearchViewModel();

  return (
    <View className="flex-1 p-4">
      {/* Departure Input */}
      <TouchableOpacity
        onPress={() => {
          clearError();
          setModalType('departure');
          setModalVisible(true);
        }}
      >
        <View className="flex-row items-center bg-white rounded-lg px-3 py-1">
          <View className="bg-green-500 px-3 py-1.5 rounded-xl mr-3">
            <Text className="text-white text-xl font-semibold">出発</Text>
          </View>
          <Text className="text-xl text-gray-800 py-4 ml-2">{departure}</Text>
        </View>
      </TouchableOpacity>

      {/* Via and Action Buttons Row */}
      <View className="flex-row justify-end items-center my-1 mr-8">
        <TouchableOpacity
          className="bg-white w-10 h-10 rounded-full justify-center items-center border border-gray-300"
          onPress={() => swapLocations(departure, arrival)}
        >
          <Text className="text-xl">⇅</Text>
        </TouchableOpacity>
      </View>

      {/* Arrival Input */}
      <TouchableOpacity
        onPress={() => {
          clearError();
          setModalType('arrival');
          setModalVisible(true);
        }}
      >
        <View className="flex-row items-center bg-white rounded-lg px-3 py-1 mb-3 ">
          <View className="bg-green-500 px-3 py-1.5 rounded-xl mr-3">
            <Text className="text-white text-xl font-semibold">到着</Text>
          </View>
          <Text className="flex-1 text-xl text-gray-800 py-4 ml-2">
            {arrival}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Date Time Selection */}
      <View className="mt-4">
        <TouchableOpacity
          className="bg-white rounded-lg px-4 py-3 border border-gray-300"
          onPress={() => setDateTimePickerVisible(true)}
        >
          <View className="flex-row items-center justify-between">
            <View>
              {selectedDateTime ? (
                <View className="flex-row items-center">
                  <Text className="text-gray-800 text-base font-medium ml-1">
                    {(() => {
                      const date = new Date(selectedDateTime.date);
                      const month = date.getMonth() + 1;
                      const day = date.getDate();
                      const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
                      const dayName = dayNames[date.getDay()];
                      return `${month}月${day}日 (${dayName})`;
                    })()}
                  </Text>
                  <Text className="text-orange-600 text-sm ml-2">
                    {selectedDateTime.type === 'departure' ? `出発 ${selectedDateTime.time}` : `到着 ${selectedDateTime.time}`}
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <View className="bg-orange-500 rounded-full w-4 h-4 mr-2 items-center justify-center">
                    <View className="bg-white rounded-full w-2 h-2"></View>
                  </View>
                  <Text className="text-gray-800 text-base font-medium">現在時刻で検索</Text>
                </View>
              )}
            </View>
            <Text className="text-gray-600 text-sm mb-1 mr-2">日時▼</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View className="bg-red-100 border border-red-400 rounded-lg p-3 mt-4">
          <Text className="text-red-700 text-center">{error}</Text>
        </View>
      )}

      {/* Search Button */}
      <TouchableOpacity
        className={`mt-6 py-3 rounded-2xl items-center ${loading ? 'bg-gray-400' : 'bg-orange-400'}`}
        onPress={() => onClick({ departure, arrival })}
        disabled={loading}
      >
        <Text className="text-white text-2xl font-semibold">
          {loading ? '検索中...' : '検索'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`border mt-6 py-3 rounded-2xl items-center ${loading ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300'}`}
        onPress={() => onTimetableSearch({ departure, arrival })}
        disabled={loading}
      >
        <Text className={`text-2xl font-semibold ${loading ? 'text-gray-500' : 'text-gray-800'}`}>
          {loading ? '検索中...' : '時刻表検索'}
        </Text>
      </TouchableOpacity>

      {/* Date Time Picker Modal */}
      <DateTimePickerModal
        visible={dateTimePickerVisible}
        onClose={() => setDateTimePickerVisible(false)}
        onConfirm={(dateTime) => {
          setSelectedDateTime(dateTime);
          setDateTimePickerVisible(false);
        }}
        currentType={selectedDateTime?.type || 'departure'}
        resetToCurrentTime={!selectedDateTime}
      />

      <ScrollableSelectionModal
        visible={modalVisible}
        defaultSelected={modalType === 'departure' ? departure : arrival}
        title={
          modalType === 'departure'
            ? '出発地を選択'
            : modalType === 'arrival'
              ? '到着地を選択'
              : '選択してください'
        }
        onClose={() => {
          setModalVisible(false);
          setModalType(null);
        }}
        onSelect={item => {
          if (modalType === 'departure') {
            setDeparture(item.name);
          } else if (modalType === 'arrival') {
            setArrival(item.name);
          }
          setModalVisible(false);
          setModalType(null);
        }}
      />
    </View>
  );
};

export default RouteSearchScreen;
