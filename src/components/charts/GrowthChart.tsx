/**
 * Growth Chart Component using react-native-chart-kit
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { GrowthMeasurement } from '../../types';
import { colors, spacing, typography } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.md * 2;
const CHART_HEIGHT = 300;

interface GrowthChartProps {
  measurements: GrowthMeasurement[];
  metric: 'weight' | 'height';
  gender: 'male' | 'female';
  onPointPress?: (measurement: GrowthMeasurement) => void;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  measurements,
  metric,
  gender,
  onPointPress,
}) => {
  // Filter measurements that have data for this metric
  const filteredMeasurements = useMemo(() => {
    return measurements.filter((m) => {
      if (metric === 'weight') return m.weightKg > 0;
      if (metric === 'height') return m.heightCm > 0;
      return false;
    });
  }, [measurements, metric]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (filteredMeasurements.length === 0) {
      return {
        labels: ['0', '3', '6', '9', '12'],
        datasets: [
          {
            data: [0, 0, 0, 0, 0],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      };
    }

    // Sort by age
    const sorted = [...filteredMeasurements].sort(
      (a, b) => a.ageInDays - b.ageInDays,
    );

    // Create labels (age in months)
    const labels = sorted.map((m) => {
      const months = Math.round(m.ageInDays / 30.44);
      return months.toString();
    });

    // Create data points
    const data = sorted.map((m) =>
      metric === 'weight' ? m.weightKg : m.heightCm,
    );

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => colors.primary,
          strokeWidth: 3,
        },
      ],
    };
  }, [filteredMeasurements, metric]);

  if (filteredMeasurements.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No {metric} measurements yet. Add your first measurement!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 1,
          color: (opacity = 1) => colors.primary,
          labelColor: (opacity = 1) => colors.textSecondary,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.primary,
            fill: colors.background,
          },
        }}
        bezier
        style={styles.chart}
        onDataPointClick={(data) => {
          const index = data.index;
          if (index !== undefined && filteredMeasurements[index] && onPointPress) {
            onPointPress(filteredMeasurements[index]);
          }
        }}
      />
      <Text style={styles.xAxisLabel}>Age (months)</Text>
      <Text style={styles.yAxisLabel}>
        {metric === 'weight' ? 'Weight (kg)' : 'Height (cm)'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  chart: {
    borderRadius: 16,
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  xAxisLabel: {
    ...typography.labelSmall,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  yAxisLabel: {
    ...typography.labelSmall,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
});
