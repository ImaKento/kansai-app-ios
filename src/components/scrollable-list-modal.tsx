import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';

interface ScrollableSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (item: any) => void;
  title?: string;
  defaultSelected?: string;
}

const ScrollableSelectionModal: React.FC<ScrollableSelectionModalProps> = ({
  visible,
  onClose,
  onSelect,
  title = '選択してください',
  defaultSelected,
}) => {
  const [selectedItem, setSelectedItem] = useState(defaultSelected || '');

  // defaultSelectedが変更されたときにselectedItemを更新
  useEffect(() => {
    if (defaultSelected) {
      setSelectedItem(defaultSelected);
    }
  }, [defaultSelected]);

  // たくさんのオプションを用意してスクロールをテスト
  const options = [
    { id: 1, label: '関西大学' },
    { id: 2, label: 'JR高槻駅北' },
    { id: 3, label: 'JR摂津富田' },
  ];

  const handleSelect = (item: any) => {
    setSelectedItem(item.label);
    if (onSelect) {
      onSelect(item);
    }
    onClose();
  };

  const { height } = Dimensions.get('window');

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View
          className="bg-white rounded-2xl w-11/12 shadow-lg"
          style={{ maxHeight: height * 0.7 }}
        >
          {/* ヘッダー */}
          <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">{title}</Text>
            <TouchableOpacity
              className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center"
              onPress={onClose}
            >
              <Text className="text-lg text-gray-600 font-bold">×</Text>
            </TouchableOpacity>
          </View>

          {/* ScrollViewバージョン */}
          <ScrollView
            className="max-h-96"
            showsVerticalScrollIndicator={true}
            bounces={false}
          >
            {options.map(item => (
              <TouchableOpacity
                key={item.id}
                className={`flex-row justify-between items-center px-4 py-4 border-b border-gray-100 ${
                  selectedItem === item.label ? 'bg-blue-50' : ''
                }`}
                onPress={() => handleSelect(item)}
              >
                <Text
                  className={`text-base ${
                    selectedItem === item.label
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-800'
                  }`}
                >
                  {item.label}
                </Text>
                {selectedItem === item.label && (
                  <Text className="text-base text-blue-600 font-bold">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* フッター */}
          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              className="bg-gray-100 py-3 px-4 rounded-lg items-center"
              onPress={onClose}
            >
              <Text className="text-base text-gray-600">キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ScrollableSelectionModal;
