/**
 * Profile Setup Screen
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
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors, spacing, typography } from '../../theme';
import { useGrowthStore } from '../../store/growthStore';
import { BabyProfile } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const ProfileScreen: React.FC = () => {
  const { profile, setProfile } = useGrowthStore();
  const [name, setName] = useState(profile?.name || '');
  const [birthDate, setBirthDate] = useState(
    profile?.birthDate ? new Date(profile.birthDate) : new Date(),
  );
  const [gender, setGender] = useState<'male' | 'female'>(
    profile?.gender || 'male',
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    const profileData: BabyProfile = {
      id: profile?.id || uuidv4(),
      name: name.trim(),
      birthDate: dayjs.utc(birthDate).startOf('day').toISOString(),
      gender,
    };

    setProfile(profileData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.title}>Baby Profile</Text>

          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Baby's Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter baby's name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Birth Date */}
          <View style={styles.field}>
            <Text style={styles.label}>Birth Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {dayjs(birthDate).format('MMM D, YYYY')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setBirthDate(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Gender */}
          <View style={styles.field}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderSelector}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('male')}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'male' && styles.genderButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('female')}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'female' && styles.genderButtonTextActive,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button title="Save Profile" onPress={handleSave} fullWidth />
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  card: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
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
  genderSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderButtonText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  genderButtonTextActive: {
    color: colors.background,
  },
});
