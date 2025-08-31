import React from 'react';
import { Text, View } from 'react-native';

const Header = () => {
  return (
    <View className="bg-gray py-1 items-center border-gray-300">
      <Text className="text-2xl text-gray-800">関大（総情）バス検索アプリ</Text>
    </View>
  );
};

export default Header;
