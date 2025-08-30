import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouteSearchViewModel } from './use-route-search.view-model';
import ScrollableSelectionModal from '../../components/scrollable-list-modal';
import { useRouteStore } from '../../store/route-store';

interface Option {
  id: number;
  label: string;
}

const RouteSearchScreen: React.FC = () => {
  const { departure, arrival, setDeparture, setArrival, swapLocations } =
    useRouteStore();
  const { modalVisible, modalType, setModalType, setModalVisible, onClick } =
    useRouteSearchViewModel();

  return (
    <View className="flex-1 p-4">
      {/* Departure Input */}
      <TouchableOpacity
        onPress={() => {
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
          className="bg-white w-12 h-12 rounded-full justify-center items-center border border-gray-300"
          onPress={() => swapLocations(departure, arrival)}
        >
          <Text className="text-xl">⇅</Text>
        </TouchableOpacity>
      </View>

      {/* Arrival Input */}
      <TouchableOpacity
        onPress={() => {
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

      {/* Search Button */}
      <TouchableOpacity
        className="bg-orange-400 mt-6 py-4 rounded-2xl items-center"
        onPress={() => onClick({ departure, arrival })}
      >
        <Text className="text-white text-2xl font-semibold">検索</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white border border-gray-300 mt-6 py-4 rounded-2xl items-center"
        onPress={() => onClick({ departure, arrival })}
      >
        <Text className="text-gray-800 text-2xl font-semibold">時刻表検索</Text>
      </TouchableOpacity>
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
            setDeparture(item.label);
          } else if (modalType === 'arrival') {
            setArrival(item.label);
          }
          setModalVisible(false);
          setModalType(null);
        }}
      />
    </View>
  );
};

export default RouteSearchScreen;
