import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import RouteCard from '../../components/route-card';
import { useRouteResultsViewModel } from './use-route-results.view-model';

const RouteResultsScreen: React.FC = () => {
  const { departure, arrival, routeResults, backToSearch } = useRouteResultsViewModel();

  return (
    <View style={styles.container}>
      {/* Route Summary */}
      <View style={styles.routeSummary}>
        <TouchableOpacity style={styles.backButton} onPress={backToSearch}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.trainIcon}>
          <Text style={styles.trainIconText}>🚂</Text>
        </View>
        <Text style={styles.routeSummaryText}>{departure} → {arrival}</Text>
      </View>

      {/* Time Navigation */}
      <View style={styles.timeNavigation}>
        <TouchableOpacity style={styles.timeNavButton}>
          <Text style={styles.timeNavText}>1本前</Text>
        </TouchableOpacity>
        
        <View style={styles.currentTime}>
          <Text style={styles.dateText}>2025年7月18日（金）</Text>
          <Text style={styles.departureText}>18:18出発</Text>
        </View>
        
        <TouchableOpacity style={styles.timeNavButton}>
          <Text style={styles.timeNavText}>1本後</Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      <ScrollView style={styles.resultsContainer}>
        {routeResults.slice(0, 2).map((route, index) => (
          <RouteCard key={route.id} route={route} index={index} />
        ))}
        
        {/* Advertisement */}
        {routeResults.length > 2 && (
          <View style={styles.adContainer}>
            <Text style={styles.adText}>PR 広告</Text>
          </View>
        )}
        
        {routeResults.slice(2).map((route, index) => (
          <RouteCard key={route.id} route={route} index={index + 2} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  routeSummary: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 20,
    color: '#333',
  },
  trainIcon: {
    marginRight: 8,
  },
  trainIconText: {
    fontSize: 16,
  },
  routeSummaryText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timeNavigation: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timeNavButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  timeNavText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  currentTime: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  departureText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  adContainer: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 40,
    alignItems: 'center',
    marginVertical: 12,
    borderRadius: 8,
  },
  adText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RouteResultsScreen;