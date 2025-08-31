import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RouteCard from '../../components/route-card';
import { useRouteStore } from '../../store/route-store';
import { useRouteResultsViewModel } from './use-route-results.view-model';

const RouteResultsScreen: React.FC = () => {
  const { departure, arrival } = useRouteStore();

  const now = new Date();
  const date = now.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  const hoursMinutes = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  const { routeResults, backToSearch, goToPreviousTime, goToNextTime, currentTimeIndex, allTimes, searchDateTime } =
    useRouteResultsViewModel();

  return (
    <View className="flex-1">
      {/* Route Summary */}
      <View className="bg-white flex-row items-center p-4 border-b border-gray-300">
        <TouchableOpacity className="mr-3" onPress={backToSearch}>
          <Text className="text-xl text-gray-800">←</Text>
        </TouchableOpacity>
        <View className="mr-2">
          <Text className="text-base"></Text>
        </View>
        <Text className="flex-1 text-base text-gray-800 font-medium">
          {departure} → {arrival}
        </Text>
      </View>

      {/* Time Navigation */}
      <View className="bg-white flex-row items-center px-4 py-3 border-b border-gray-300">
        <TouchableOpacity 
          className={`px-4 py-2 rounded-2xl ${currentTimeIndex > 0 ? 'bg-orange-500' : 'bg-gray-300'}`}
          onPress={goToPreviousTime}
          disabled={currentTimeIndex <= 0}
        >
          <Text className={`text-sm font-medium ${currentTimeIndex > 0 ? 'text-white' : 'text-gray-500'}`}>
            1本前
          </Text>
        </TouchableOpacity>

        <View className="flex-1 items-center mx-4">
          {searchDateTime ? (
            <View className="items-center">
              <Text className="text-sm text-gray-500 mb-0.5">
                {(() => {
                  const searchDate = new Date(searchDateTime.date);
                  const month = searchDate.getMonth() + 1;
                  const day = searchDate.getDate();
                  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
                  const dayName = dayNames[searchDate.getDay()];
                  return `${month}月${day}日 (${dayName})`;
                })()}
              </Text>
              <Text className="text-base text-gray-800 font-semibold">
                {searchDateTime.type === 'departure' ? '出発' : '到着'} {searchDateTime.time}で検索
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <Text className="text-sm text-gray-500 mb-0.5">
                {date}
              </Text>
              <Text className="text-base text-gray-800 font-semibold">
                {hoursMinutes}現在
              </Text>
            </View>
          )}
          {allTimes.length > 0 && (
            <Text className="text-xs text-gray-400 mt-0.5">
              {currentTimeIndex + 1}-{Math.min(currentTimeIndex + 4, allTimes.length)} / {allTimes.length}便
            </Text>
          )}
        </View>

        <TouchableOpacity 
          className={`px-4 py-2 rounded-2xl ${currentTimeIndex < Math.max(0, allTimes.length - 4) ? 'bg-orange-500' : 'bg-gray-300'}`}
          onPress={goToNextTime}
          disabled={currentTimeIndex >= Math.max(0, allTimes.length - 4)}
        >
          <Text className={`text-sm font-medium ${currentTimeIndex < Math.max(0, allTimes.length - 4) ? 'text-white' : 'text-gray-500'}`}>
            1本後
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      <ScrollView className="flex-1 p-4">
        {routeResults.slice(0, 2).map((route, index) => (
          <RouteCard key={route.id} route={route} index={index} />
        ))}

        {/* Advertisement */}
        {routeResults.length > 2 && (
          <View className="bg-blue-50 py-10 items-center my-3 rounded-lg">
            <Text className="text-blue-500 text-base font-medium">PR 広告</Text>
          </View>
        )}

        {routeResults.slice(2).map((route, index) => (
          <RouteCard key={route.id} route={route} index={index + 2} />
        ))}
      </ScrollView>
    </View>
  );
};

export default RouteResultsScreen;
