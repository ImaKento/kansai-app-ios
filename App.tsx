import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Header from './src/components/header';
import TabNavigation from './src/components/tab-navigation';
import RouteSearchScreen from './src/screens/route-search/route-search.view';
import RouteResultsScreen from './src/screens/route-results/route-results.view';
import TimetableScreen from './src/screens/timetable/timetable.view';
import { useAppViewModel } from './AppViewModel';
import './global.css';

const App = () => {
  const { activeTab, setActiveTab } = useAppViewModel();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={false}
      />
      
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'route' ? (
        <RouteSearchScreen />
      ) : activeTab === 'result' ? (
        <RouteResultsScreen />
      ) : activeTab === 'timetable' ? (
        <TimetableScreen />
      ) : (
        <RouteSearchScreen />
      )}
    </SafeAreaView>
  );
};

export default App;