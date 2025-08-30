import React from 'react';
import { View, Text } from 'react-native';

const Header = () => {
  return (
    <View className="bg-gray py-4 items-center border-gray-300 ios:shadow-sm android:elevation-2">
      <Text className="text-3xl text-gray-800">経路検索アプリ</Text>
    </View>
  );
};

export default Header;
