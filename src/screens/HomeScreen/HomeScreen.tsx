/**
 * Home Screen - Dashboard with growth chart
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useGrowthData } from '../../hooks/useGrowthData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { GrowthChart } from '../../components/charts/GrowthChart';
import { colors, spacing, typography } from '../../theme';
import { GrowthMeasurement } from '../../types';
import { formatDate, formatAge } from '../../utils/dateUtils';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, measurements, loadData, getLatestMeasurement } = useGrowthData();
  const latestMeasurement = getLatestMeasurement();
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'height'>('weight');
  const [selectedPoint, setSelectedPoint] = useState<GrowthMeasurement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Please set up your baby's profile</Text>
          <Button
            title="Set Up Profile"
            onPress={() => navigation.navigate('Profile' as never)}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handlePointPress = (measurement: GrowthMeasurement) => {
    setSelectedPoint(measurement);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{profile.name}'s Growth</Text>
        </View>

        {/* Metric selector */}
        <View style={styles.metricSelector}>
          <TouchableOpacity
            style={[
              styles.metricButton,
              selectedMetric === 'weight' && styles.metricButtonActive,
            ]}
            onPress={() => setSelectedMetric('weight')}
          >
            <Text
              style={[
                styles.metricButtonText,
                selectedMetric === 'weight' && styles.metricButtonTextActive,
              ]}
            >
              Weight
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.metricButton,
              selectedMetric === 'height' && styles.metricButtonActive,
            ]}
            onPress={() => setSelectedMetric('height')}
          >
            <Text
              style={[
                styles.metricButtonText,
                selectedMetric === 'height' && styles.metricButtonTextActive,
              ]}
            >
              Height
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        <Card style={styles.chartCard}>
          {measurements.length > 0 ? (
            <GrowthChart
              measurements={measurements}
              metric={selectedMetric}
              gender={profile.gender}
              onPointPress={handlePointPress}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>
                No measurements yet. Add your first measurement to see the growth chart!
              </Text>
            </View>
          )}
        </Card>

        {/* Selected point details */}
        {selectedPoint && (
          <Card style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Measurement Details</Text>
            <Text style={styles.detailsText}>
              Date: {formatDate(selectedPoint.date)}
            </Text>
            <Text style={styles.detailsText}>
              Age: {formatAge(selectedPoint.ageInDays)}
            </Text>
            {selectedMetric === 'weight' && selectedPoint.weightKg > 0 && (
              <>
                <Text style={styles.detailsText}>
                  Weight: {selectedPoint.weightKg.toFixed(1)} kg
                </Text>
                {selectedPoint.weightPercentile && (
                  <Text style={styles.detailsText}>
                    Percentile: {selectedPoint.weightPercentile.toFixed(1)}th
                  </Text>
                )}
              </>
            )}
            {selectedMetric === 'height' && selectedPoint.heightCm > 0 && (
              <>
                <Text style={styles.detailsText}>
                  Height: {selectedPoint.heightCm.toFixed(1)} cm
                </Text>
                {selectedPoint.heightPercentile && (
                  <Text style={styles.detailsText}>
                    Percentile: {selectedPoint.heightPercentile.toFixed(1)}th
                  </Text>
                )}
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedPoint(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Quick stats */}
        {latestMeasurement && (
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Latest Measurement</Text>
            {latestMeasurement.weightKg > 0 && (
              <Text style={styles.statsValue}>
                Weight: {latestMeasurement.weightKg.toFixed(1)} kg
                {latestMeasurement.weightPercentile &&
                  ` (${latestMeasurement.weightPercentile.toFixed(1)}th percentile)`}
              </Text>
            )}
            {latestMeasurement.heightCm > 0 && (
              <Text style={styles.statsValue}>
                Height: {latestMeasurement.heightCm.toFixed(1)} cm
                {latestMeasurement.heightPercentile &&
                  ` (${latestMeasurement.heightPercentile.toFixed(1)}th percentile)`}
              </Text>
            )}
            <Text style={styles.statsDate}>
              {formatDate(latestMeasurement.date)}
            </Text>
          </Card>
        )}

        {/* Add measurement button */}
        <Button
          title="+ Add Measurement"
          onPress={() => navigation.navigate('AddMeasurement' as never)}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  metricSelector: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  metricButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  metricButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  metricButtonText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  metricButtonTextActive: {
    color: colors.background,
  },
  chartCard: {
    marginBottom: spacing.md,
    minHeight: 300,
  },
  emptyChart: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyChartText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  detailsCard: {
    marginBottom: spacing.md,
  },
  detailsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  detailsText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  closeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  closeButtonText: {
    ...typography.label,
    color: colors.primary,
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  statsTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  statsValue: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statsDate: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
});

