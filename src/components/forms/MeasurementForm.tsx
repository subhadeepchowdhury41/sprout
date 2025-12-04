/**
 * Measurement Form Component
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { colors, spacing, typography } from '../../theme';
import { MeasurementFormData } from '../../types';
import { getTodayISO, formatDate } from '../../utils/dateUtils';
import {
  lbToKg,
  inToCm,
  kgToLb,
  cmToIn,
} from '../../utils/unitConversion';
import dayjs from 'dayjs';

const measurementSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  weight: z.number().min(0.1, 'Weight must be greater than 0'),
  height: z.number().min(20, 'Height must be at least 20 cm'),
  head: z.number().min(20, 'Head circumference must be at least 20 cm'),
  unit: z.enum(['metric', 'imperial']),
});

interface MeasurementFormProps {
  onSubmit: (data: MeasurementFormData) => void;
  initialData?: Partial<MeasurementFormData>;
  onCancel?: () => void;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [unit, setUnit] = useState<'metric' | 'imperial'>(
    initialData?.unit || 'metric',
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      date: initialData?.date || getTodayISO(),
      weight: initialData?.weight || 0,
      height: initialData?.height || 0,
      head: initialData?.head || 0,
      unit: unit,
    },
  });

  const watchedDate = watch('date');
  const watchedWeight = watch('weight');
  const watchedHeight = watch('height');
  const watchedHead = watch('head');

  const handleFormSubmit = (data: MeasurementFormData) => {
    onSubmit(data);
  };

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    setValue('unit', newUnit);

    // Convert values
    if (newUnit === 'imperial') {
      if (watchedWeight > 0) setValue('weight', kgToLb(watchedWeight));
      if (watchedHeight > 0) setValue('height', cmToIn(watchedHeight));
      if (watchedHead > 0) setValue('head', cmToIn(watchedHead));
    } else {
      if (watchedWeight > 0) setValue('weight', lbToKg(watchedWeight));
      if (watchedHeight > 0) setValue('height', inToCm(watchedHeight));
      if (watchedHead > 0) setValue('head', inToCm(watchedHead));
    }
  };

  const getConvertedValue = (value: number, isWeight: boolean) => {
    if (value === 0) return '';
    if (unit === 'metric') {
      return isWeight ? `(${kgToLb(value).toFixed(1)} lb)` : `(${cmToIn(value).toFixed(1)} in)`;
    } else {
      return isWeight ? `(${lbToKg(value).toFixed(1)} kg)` : `(${inToCm(value).toFixed(1)} cm)`;
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.formCard}>
        {/* Date Picker */}
        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {watchedDate ? formatDate(watchedDate) : 'Select date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={watchedDate ? new Date(watchedDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setValue('date', dayjs(selectedDate).utc().startOf('day').toISOString());
                }
              }}
              maximumDate={new Date()}
            />
          )}
          {errors.date && (
            <Text style={styles.error}>{errors.date.message}</Text>
          )}
        </View>

        {/* Unit Toggle */}
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'metric' && styles.unitButtonActive]}
            onPress={() => unit !== 'metric' && toggleUnit()}
          >
            <Text
              style={[
                styles.unitButtonText,
                unit === 'metric' && styles.unitButtonTextActive,
              ]}
            >
              Metric (kg, cm)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'imperial' && styles.unitButtonActive]}
            onPress={() => unit !== 'imperial' && toggleUnit()}
          >
            <Text
              style={[
                styles.unitButtonText,
                unit === 'imperial' && styles.unitButtonTextActive,
              ]}
            >
              Imperial (lb, in)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weight */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Weight {unit === 'metric' ? '(kg)' : '(lb)'}
          </Text>
          <Controller
            control={control}
            name="weight"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={styles.input}
                  value={value > 0 ? value.toString() : ''}
                  onChangeText={(text) => {
                    const num = parseFloat(text) || 0;
                    onChange(num);
                  }}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                />
                {value > 0 && (
                  <Text style={styles.conversionHint}>
                    {getConvertedValue(value, true)}
                  </Text>
                )}
              </View>
            )}
          />
          {errors.weight && (
            <Text style={styles.error}>{errors.weight.message}</Text>
          )}
        </View>

        {/* Height */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Height/Length {unit === 'metric' ? '(cm)' : '(in)'}
          </Text>
          <Controller
            control={control}
            name="height"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={styles.input}
                  value={value > 0 ? value.toString() : ''}
                  onChangeText={(text) => {
                    const num = parseFloat(text) || 0;
                    onChange(num);
                  }}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                />
                {value > 0 && (
                  <Text style={styles.conversionHint}>
                    {getConvertedValue(value, false)}
                  </Text>
                )}
              </View>
            )}
          />
          {errors.height && (
            <Text style={styles.error}>{errors.height.message}</Text>
          )}
        </View>

        {/* Head Circumference */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Head Circumference {unit === 'metric' ? '(cm)' : '(in)'}
          </Text>
          <Controller
            control={control}
            name="head"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={styles.input}
                  value={value > 0 ? value.toString() : ''}
                  onChangeText={(text) => {
                    const num = parseFloat(text) || 0;
                    onChange(num);
                  }}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                />
                {value > 0 && (
                  <Text style={styles.conversionHint}>
                    {getConvertedValue(value, false)}
                  </Text>
                )}
              </View>
            )}
          />
          {errors.head && (
            <Text style={styles.error}>{errors.head.message}</Text>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          {onCancel && (
            <Button
              title="Cancel"
              variant="outline"
              onPress={onCancel}
              style={styles.cancelButton}
            />
          )}
          <Button
            title="Save Measurement"
            onPress={handleSubmit(handleFormSubmit)}
            fullWidth={!onCancel}
            style={styles.submitButton}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formCard: {
    margin: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  conversionHint: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.labelSmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  dateButtonText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  unitToggle: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  unitButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitButtonText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  unitButtonTextActive: {
    color: colors.background,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});

