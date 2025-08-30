import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'route' && styles.activeTab]}
        onPress={() => onTabChange('route')}
      >
        <Text style={[styles.tabText, activeTab === 'route' && styles.activeTabText]}>
          ルート検索
        </Text>
        {activeTab === 'route' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'result' && styles.activeTab]}
        onPress={() => onTabChange('result')}
      >
        <Text style={[styles.tabText, activeTab === 'result' && styles.activeTabText]}>
          検索結果
        </Text>
        {activeTab === 'result' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  activeTabText: {
    color: '#4a90e2',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#4a90e2',
  },
});

export default TabNavigation;