import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RouteData } from '../types/RouteData';

interface RouteCardProps {
  route: RouteData;
  index: number;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, index }) => {
  return (
    <View className="bg-white rounded-lg mb-3 ios:shadow-md android:elevation-3">
      <View className="flex-row p-4 items-start">
        <View className="bg-blue-500 w-6 h-6 rounded-full justify-center items-center mr-3">
          <Text className="text-white text-sm font-semibold">{route.id}</Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-lg font-semibold text-gray-800 mr-2">
              {route.time}
            </Text>
            <Text className="text-sm text-gray-500">（{route.duration}）</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Text className="text-base text-blue-500 font-semibold mr-3">
              {route.price}
            </Text>
            <Text className="text-sm text-gray-500">{route.transfers}</Text>
          </View>

          <View className="flex-row items-center flex-wrap">
            {route.lines.map((line, idx) => (
              <View
                key={idx}
                className="px-2 py-1 rounded mr-1.5 mb-1"
                style={{ backgroundColor: line.color }}
              >
                <Text className="text-white text-xs font-medium">
                  {line.name}
                </Text>
              </View>
            ))}
            {route.route && (
              <Text className="text-sm text-gray-500 ml-1">{route.route}</Text>
            )}
          </View>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity className="bg-orange-500 w-9 h-9 rounded-full justify-center items-center">
            <Text className="text-base">🔖</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-orange-500 w-9 h-9 rounded-full justify-center items-center">
            <Text className="text-base">ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RouteCard;
