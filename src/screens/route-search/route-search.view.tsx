import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouteSearchViewModel } from './use-route-search.view-model';

const RouteSearchScreen: React.FC = () => {
  const { 
    departure, 
    arrival, 
    setDeparture, 
    setArrival, 
    swapLocations,
    performSearch
  } = useRouteSearchViewModel();

  return (
    <View style={styles.formContainer}>
      {/* Departure Input */}
      <View style={styles.inputContainer}>
        <View style={[styles.locationBadge, styles.departureBadge]}>
          <Text style={styles.badgeText}>出発</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={departure}
          onChangeText={setDeparture}
          placeholder="出発地を入力"
          placeholderTextColor="#999"
        />
      </View>

      {/* Via and Action Buttons Row */}
      <View style={styles.actionRow}>
        {/* <TouchableOpacity style={styles.viaButton}>
          <Text style={styles.viaButtonText}>+ 経由</Text>
        </TouchableOpacity> */}
        
        <View style={styles.actionButtons}>
          {/* <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🎤</Text>
          </TouchableOpacity> */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={swapLocations}
          >
            <Text style={styles.actionButtonText}>⇅</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Arrival Input */}
      <View style={styles.inputContainer}>
        <View style={[styles.locationBadge, styles.arrivalBadge]}>
          <Text style={styles.badgeText}>到着</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={arrival}
          onChangeText={setArrival}
          placeholder="到着地を入力"
          placeholderTextColor="#999"
        />
      </View>

      {/* Time Selection */}
      <TouchableOpacity style={styles.timeSelector}>
        <View style={styles.timeRow}>
          <Text style={styles.timeIcon}>🕐</Text>
          <Text style={styles.timeText}>現在時刻</Text>
          <Text style={styles.dateDropdown}>日時 ▼</Text>
        </View>
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={performSearch}>
        <Text style={styles.searchButtonText}>検索</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  locationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  departureBadge: {
    backgroundColor: '#4CAF50',
  },
  arrivalBadge: {
    backgroundColor: '#4CAF50',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  viaButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '400',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  actionButtonText: {
    fontSize: 16,
  },
  timeSelector: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  dateDropdown: {
    color: '#666',
    fontSize: 14,
    fontWeight: '400',
  },
  searchButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF9800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RouteSearchScreen;