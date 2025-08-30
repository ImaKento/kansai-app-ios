import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Header from './src/components/header';
import TabNavigation from './src/components/tab-navigation';
import RouteSearchScreen from './src/screens/route-search/route-search.view';
import RouteResultsScreen from './src/screens/route-results/route-results.view';
import { useAppViewModel } from './AppViewModel';

const App = () => {
  const { activeTab, setActiveTab } = useAppViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={false}
      />
      
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'route' ? (
        <RouteSearchScreen />
      ) : (
        <RouteResultsScreen />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;