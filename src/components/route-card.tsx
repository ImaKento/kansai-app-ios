import React from 'react';
import { Text, View } from 'react-native';
import { RouteData } from '../types/RouteData';

interface RouteCardProps {
  route: RouteData;
  index: number;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, index }) => {

  // 混雑度に応じた色を決定
  const getCongestionStyle = (congestion: string) => {
    switch (congestion) {
      case '混雑':
        return { bg: 'bg-red-100', text: 'text-red-700' };
      case '少し混雑':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case '普通':
        return { bg: 'bg-green-100', text: 'text-green-700' };
      default:
        return { bg: 'bg-green-100', text: 'text-green-700' };
    }
  };
  const congestionStyle = getCongestionStyle(route.estimatedCongestion);

  return (
    <View className="bg-white border border-gray-300 rounded-lg mb-3">
      <View className="flex-row p-4 items-start">
        <View className="bg-blue-500 w-6 h-6 rounded-full justify-center items-center mr-4">
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
            <View className={`${congestionStyle.bg} ml-3 px-2 py-1 rounded`}>
              <Text className={`text-xs ${congestionStyle.text}`}>混雑予想　{route.estimatedCongestion}</Text>
            </View>
          </View>

          {/* <View className="flex-row items-center flex-wrap">
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
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default RouteCard;
