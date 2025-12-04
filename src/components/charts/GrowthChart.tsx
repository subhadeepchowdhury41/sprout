/**
 * Growth Chart Component using Victory Native
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import { GrowthMeasurement } from '../../types';
import { colors, spacing } from '../../theme';
import { getLMSData } from '../../services/percentiles/lmsCalculator';
import { calculatePercentile } from '../../services/percentiles/percentileCalculator';

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
  // Get LMS data for percentile curves
  const lmsData = useMemo(() => getLMSData(metric, gender), [metric, gender]);

  // Filter measurements that have data for this metric
  const filteredMeasurements = useMemo(() => {
    return measurements.filter((m) => {
      if (metric === 'weight') return m.weightKg > 0;
      if (metric === 'height') return m.heightCm > 0;
      return false;
    });
  }, [measurements, metric]);

  // Prepare percentile curves data (3, 10, 25, 50, 75, 90, 97)
  const percentileCurves = useMemo(() => {
    if (lmsData.length === 0) return [];

    const percentiles = [3, 10, 25, 50, 75, 90, 97];
    return percentiles.map((p) => {
      return lmsData.map((lms) => {
        // Calculate value for this percentile at this age
        const zScore = percentileToZScore(p);
        const value = calculateValueFromZScore(zScore, lms.L, lms.M, lms.S);
        return {
          x: lms.ageDays / 30.44, // Convert days to months for display
          y: metric === 'weight' ? value : value,
        };
      });
    });
  }, [lmsData, metric]);

  // Prepare baby data points
  const babyDataPoints = useMemo(() => {
    return filteredMeasurements.map((m) => ({
      x: m.ageInDays / 30.44, // Convert days to months
      y: metric === 'weight' ? m.weightKg : m.heightCm,
      measurement: m,
    }));
  }, [filteredMeasurements, metric]);

  // Calculate domain
  const xDomain = useMemo(() => {
    if (filteredMeasurements.length === 0) return [0, 12];
    const maxAge = Math.max(
      ...filteredMeasurements.map((m) => m.ageInDays / 30.44),
    );
    return [0, Math.max(12, Math.ceil(maxAge + 1))];
  }, [filteredMeasurements]);

  const yDomain = useMemo(() => {
    if (filteredMeasurements.length === 0) {
      return metric === 'weight' ? [0, 15] : [40, 100];
    }
    const values = filteredMeasurements.map((m) =>
      metric === 'weight' ? m.weightKg : m.heightCm,
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2;
    return [Math.max(0, min - padding), max + padding];
  }, [filteredMeasurements, metric]);

  if (filteredMeasurements.length === 0 && lmsData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {/* Empty state */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VictoryChart
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        theme={VictoryTheme.material}
        domain={{ x: xDomain, y: yDomain }}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiBlacklist={percentileCurves.map((_, i) => `percentile-${i}`)}
            onTouchStart={(_, props) => {
              if (props.datum?.measurement && onPointPress) {
                onPointPress(props.datum.measurement);
              }
            }}
          />
        }
      >
        {/* Percentile curves */}
        {percentileCurves.map((curve, index) => {
          const percentile = [3, 10, 25, 50, 75, 90, 97][index];
          const isMedian = percentile === 50;
          return (
            <VictoryLine
              key={`percentile-${index}`}
              data={curve}
              style={{
                data: {
                  stroke: isMedian ? colors.percentile50 : colors.chartGrid,
                  strokeWidth: isMedian ? 2 : 1,
                  strokeDasharray: isMedian ? undefined : '5,5',
                },
              }}
            />
          );
        })}

        {/* Baby data points */}
        <VictoryScatter
          data={babyDataPoints}
          size={6}
          style={{
            data: {
              fill: colors.chartPoint,
            },
          }}
        />

        {/* Axes */}
        <VictoryAxis
          label="Age (months)"
          style={{
            axis: { stroke: colors.textSecondary },
            tickLabels: { fill: colors.textSecondary, fontSize: 10 },
            axisLabel: { fill: colors.textPrimary, fontSize: 12, padding: 30 },
          }}
        />
        <VictoryAxis
          dependentAxis
          label={metric === 'weight' ? 'Weight (kg)' : 'Height (cm)'}
          style={{
            axis: { stroke: colors.textSecondary },
            tickLabels: { fill: colors.textSecondary, fontSize: 10 },
            axisLabel: { fill: colors.textPrimary, fontSize: 12, padding: 40 },
          }}
        />
      </VictoryChart>
    </View>
  );
};

// Helper functions
function percentileToZScore(percentile: number): number {
  // Approximation for normal distribution
  // More accurate implementation would use statistical library
  const p = percentile / 100;
  if (p === 0.5) return 0;
  if (p < 0.5) {
    return -Math.abs(normalQuantile(p));
  }
  return Math.abs(normalQuantile(p));
}

function normalQuantile(p: number): number {
  // Approximation of the inverse CDF for standard normal distribution
  // Source: Peter J. Acklam's algorithm (simplified implementation)
  if (p <= 0 || p >= 1) {
    throw new Error('p must be in (0, 1)');
  }

  const a1 = -39.6968302866538;
  const a2 = 220.946098424521;
  const a3 = -275.928510446969;
  const a4 = 138.357751867269;
  const a5 = -30.6647980661472;
  const a6 = 2.50662827745924;

  const b1 = -54.4760987982241;
  const b2 = 161.585836858041;
  const b3 = -155.698979859887;
  const b4 = 66.8013118877197;
  const b5 = -13.2806815528857;

  const c1 = -0.00778489400243029;
  const c2 = -0.322396458041136;
  const c3 = -2.40075827716184;
  const c4 = -2.54973253934373;
  const c5 = 4.37466414146497;
  const c6 = 2.93816398269878;

  const d1 = 0.00778469570904146;
  const d2 = 0.32246712907004;
  const d3 = 2.445134137143;
  const d4 = 3.75440866190742;

  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q;

  if (p < pLow) {
    // Lower region
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  }

  if (p > pHigh) {
    // Upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  }

  // Central region
  q = p - 0.5;
  const r = q * q;
  return (
    (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
    (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1)
  );
}

function calculateValueFromZScore(
  zScore: number,
  L: number,
  M: number,
  S: number,
): number {
  if (L === 0) {
    // Normal distribution
    return M * Math.exp(zScore * S);
  } else {
    // Box-Cox transformation
    return M * Math.pow(1 + L * S * zScore, 1 / L);
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

