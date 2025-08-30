import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import RouteCard from '../../components/route-card';
import { useRouteResultsViewModel } from './use-route-results.view-model';

const RouteResultsScreen: React.FC = () => {
  const { departure, arrival, routeResults, backToSearch } =
    useRouteResultsViewModel();

  return (
    <View className="flex-1">
      {/* Route Summary */}
      <View className="bg-white flex-row items-center p-4 border-b border-gray-300">
        <TouchableOpacity className="mr-3" onPress={backToSearch}>
          <Text className="text-xl text-gray-800">←</Text>
        </TouchableOpacity>
        <View className="mr-2">
          <Text className="text-base">🚂</Text>
        </View>
        <Text className="flex-1 text-base text-gray-800 font-medium">
          {departure} → {arrival}
        </Text>
      </View>

      {/* Time Navigation */}
      <View className="bg-white flex-row items-center px-4 py-3 border-b border-gray-300">
        <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-2xl">
          <Text className="text-white text-sm font-medium">1本前</Text>
        </TouchableOpacity>

        <View className="flex-1 items-center mx-4">
          <Text className="text-sm text-gray-500 mb-0.5">
            2025年7月18日（金）
          </Text>
          <Text className="text-base text-gray-800 font-semibold">
            18:18出発
          </Text>
        </View>

        <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-2xl">
          <Text className="text-white text-sm font-medium">1本後</Text>
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
