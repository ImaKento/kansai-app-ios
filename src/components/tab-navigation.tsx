import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View className="flex-row bg-gray border-b border-gray-300">
      <TouchableOpacity
        className="flex-1 py-3 items-center relative"
        onPress={() => onTabChange('route')}
      >
        <Text
          className={`text-xl p-1 ${activeTab === 'route' ? 'text-blue-500 font-semibold' : 'text-gray-500 font-normal'}`}
        >
          ルート検索
        </Text>
        {activeTab === 'route' && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 py-3 items-center relative"
        onPress={() => onTabChange('result')}
      >
        <Text
          className={`text-xl p-1 ${activeTab === 'result' ? 'text-blue-500 font-semibold' : 'text-gray-500 font-normal'}`}
        >
          検索結果
        </Text>
        {activeTab === 'result' && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TabNavigation;
