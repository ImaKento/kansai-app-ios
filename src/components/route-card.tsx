import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { RouteData } from '../types/RouteData';

interface RouteCardProps {
  route: RouteData;
  index: number;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, index }) => {
  return (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <View style={styles.routeNumber}>
          <Text style={styles.routeNumberText}>{route.id}</Text>
        </View>
        
        <View style={styles.routeInfo}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{route.time}</Text>
            <Text style={styles.durationText}>（{route.duration}）</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{route.price}</Text>
            <Text style={styles.transferText}>{route.transfers}</Text>
          </View>
          
          <View style={styles.lineRow}>
            {route.lines.map((line, idx) => (
              <View key={idx} style={[styles.lineBadge, { backgroundColor: line.color }]}>
                <Text style={styles.lineBadgeText}>{line.name}</Text>
              </View>
            ))}
            {route.route && <Text style={styles.routeText}>{route.route}</Text>}
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🔖</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  routeHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  routeNumber: {
    backgroundColor: '#2196F3',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  routeInfo: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    marginRight: 12,
  },
  transferText: {
    fontSize: 14,
    color: '#666',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  lineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  lineBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  routeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#FF9800',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
  },
});

export default RouteCard;