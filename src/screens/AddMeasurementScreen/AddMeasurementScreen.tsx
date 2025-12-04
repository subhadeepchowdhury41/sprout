/**
 * Add Measurement Screen
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MeasurementForm } from '../../components/forms/MeasurementForm';
import { colors } from '../../theme';
import { useGrowthStore } from '../../store/growthStore';
import { MeasurementFormData, GrowthMeasurement } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { calculateAgeInDays } from '../../utils/dateUtils';
import { lbToKg, inToCm } from '../../utils/unitConversion';
import { useNavigation } from '@react-navigation/native';

export const AddMeasurementScreen: React.FC = () => {
  const { profile, addMeasurement } = useGrowthStore();
  const navigation = useNavigation();

  const handleSubmit = (data: MeasurementFormData) => {
    if (!profile) return;

    // Convert to SI units
    const weightKg = data.unit === 'metric' ? data.weight : lbToKg(data.weight);
    const heightCm = data.unit === 'metric' ? data.height : inToCm(data.height);
    const headCm = data.unit === 'metric' ? data.head : inToCm(data.head);

    // Calculate age
    const ageInDays = calculateAgeInDays(profile.birthDate, data.date);

    // Create measurement
    const measurement: GrowthMeasurement = {
      id: uuidv4(),
      date: data.date,
      ageInDays,
      weightKg,
      heightCm,
      headCm,
    };

    addMeasurement(measurement);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <MeasurementForm onSubmit={handleSubmit} onCancel={() => navigation.goBack()} />
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
});

