# Project Structure

## Overview

This project follows a **feature-based architecture** with clear separation of concerns, making it easy to maintain, test, and scale.

## Directory Structure

```
sprout/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Generic components (Button, Card, Input, etc.)
│   │   ├── charts/          # Chart-related components
│   │   └── forms/           # Form-specific components
│   │
│   ├── screens/             # Screen components (full pages)
│   │   ├── HomeScreen/
│   │   ├── AddMeasurementScreen/
│   │   ├── ChartScreen/
│   │   ├── HistoryScreen/
│   │   └── ProfileScreen/
│   │
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   │
│   ├── store/               # State management (Zustand)
│   │   ├── growthStore.ts
│   │   └── types.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useGrowthData.ts
│   │   ├── usePercentile.ts
│   │   ├── useUnitConversion.ts
│   │   └── useAgeCalculation.ts
│   │
│   ├── services/            # Business logic & API layer
│   │   ├── storage/
│   │   │   ├── storageService.ts
│   │   │   └── migrations.ts
│   │   ├── percentiles/
│   │   │   ├── percentileCalculator.ts
│   │   │   └── lmsCalculator.ts
│   │   └── validation/
│   │       └── measurementValidator.ts
│   │
│   ├── utils/               # Pure utility functions
│   │   ├── dateUtils.ts
│   │   ├── unitConversion.ts
│   │   ├── calculations.ts
│   │   └── constants.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── measurement.ts
│   │   ├── profile.ts
│   │   └── growth.ts
│   │
│   ├── data/                # Static data files
│   │   ├── growthReferences/
│   │   │   ├── whoWeightMale.json
│   │   │   ├── whoWeightFemale.json
│   │   │   ├── whoHeightMale.json
│   │   │   └── whoHeightFemale.json
│   │   └── README.md        # Data source citations
│   │
│   ├── theme/               # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   └── __tests__/           # Unit tests (mirrors src structure)
│       ├── utils/
│       ├── services/
│       └── hooks/
│
├── assets/                  # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── android/                 # Android native code
├── ios/                     # iOS native code
│
├── App.tsx                  # Root component
├── index.js                 # Entry point
│
├── __tests__/               # Integration tests
├── jest.config.js
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── package.json
└── README.md
```

## Detailed Breakdown

### `/src/components/`

**Purpose**: Reusable UI components that can be used across multiple screens.

- **`common/`**: Generic components like buttons, cards, inputs, modals
- **`charts/`**: Chart-specific components (wrapper around Victory Native)
- **`forms/`**: Form field components with validation

**Example files:**

- `common/Button.tsx`
- `common/Card.tsx`
- `common/Input.tsx`
- `charts/GrowthChart.tsx`
- `charts/PercentileCurves.tsx`
- `forms/MeasurementForm.tsx`

### `/src/screens/`

**Purpose**: Full-screen components that represent distinct user flows.

Each screen folder contains:

- `ScreenName.tsx` - Main component
- `ScreenName.styles.ts` - Styles (if complex)
- `index.ts` - Export file

**Screens:**

- `HomeScreen/` - Dashboard with chart and quick stats
- `AddMeasurementScreen/` - Form to add/edit measurements
- `ChartScreen/` - Detailed chart view with interactions
- `HistoryScreen/` - List of all measurements
- `ProfileScreen/` - Baby profile management

### `/src/navigation/`

**Purpose**: Navigation configuration and type definitions.

- `AppNavigator.tsx` - Main navigation setup
- `types.ts` - Navigation param types

### `/src/store/`

**Purpose**: Global state management using Zustand.

- `growthStore.ts` - Main store with actions
- `types.ts` - Store-related types

### `/src/hooks/`

**Purpose**: Custom React hooks for reusable logic.

- `useGrowthData.ts` - Fetch and manage growth data
- `usePercentile.ts` - Calculate percentiles
- `useUnitConversion.ts` - Handle unit conversions
- `useAgeCalculation.ts` - Calculate age in days

### `/src/services/`

**Purpose**: Business logic, data processing, and external integrations.

- **`storage/`**: AsyncStorage wrapper, migrations
- **`percentiles/`**: Percentile calculation logic (LMS method)
- **`validation/`**: Form validation schemas and rules

### `/src/utils/`

**Purpose**: Pure utility functions with no side effects.

- `dateUtils.ts` - Date formatting, age calculations
- `unitConversion.ts` - kg↔lb, cm↔in conversions
- `calculations.ts` - Math utilities
- `constants.ts` - App-wide constants

### `/src/types/`

**Purpose**: TypeScript type definitions.

- `index.ts` - Re-export all types
- `measurement.ts` - GrowthMeasurement interface
- `profile.ts` - BabyProfile interface
- `growth.ts` - Growth reference data types

### `/src/data/`

**Purpose**: Static reference data (WHO growth charts).

- JSON files with WHO LMS parameters or percentile tables
- `README.md` documenting data sources

### `/src/theme/`

**Purpose**: Design system constants.

- `colors.ts` - Color palette
- `typography.ts` - Font sizes, weights
- `spacing.ts` - Spacing scale
- `index.ts` - Theme object

### `/src/__tests__/`

**Purpose**: Unit tests organized to mirror src structure.

## File Naming Conventions

- **Components**: PascalCase (`GrowthChart.tsx`)
- **Hooks**: camelCase with `use` prefix (`useGrowthData.ts`)
- **Utils/Services**: camelCase (`dateUtils.ts`, `storageService.ts`)
- **Types**: camelCase (`measurement.ts`)
- **Constants**: UPPER_SNAKE_CASE in constants file
- **Tests**: Same name as file + `.test.ts` (`dateUtils.test.ts`)

## Import Path Strategy

Use **absolute imports** from `src/`:

```typescript
// Instead of: import { Button } from '../../../components/common/Button'
import { Button } from 'src/components/common/Button';
import { useGrowthData } from 'src/hooks/useGrowthData';
import { GrowthMeasurement } from 'src/types';
```

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "src/*": ["src/*"]
    }
  }
}
```

## Component Organization Principles

1. **Single Responsibility**: Each component does one thing well
2. **Composition**: Build complex components from simple ones
3. **Reusability**: Extract common patterns into components
4. **Testability**: Keep components pure and testable
5. **Type Safety**: Use TypeScript strictly

## Example Component Structure

```typescript
// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // ...
});
```

## Example Screen Structure

```typescript
// src/screens/HomeScreen/HomeScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { GrowthChart } from 'src/components/charts/GrowthChart';
import { useGrowthData } from 'src/hooks/useGrowthData';
import { styles } from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const { measurements, profile } = useGrowthData();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile?.name}'s Growth</Text>
      <GrowthChart measurements={measurements} />
    </View>
  );
};
```

## Benefits of This Structure

1. **Scalability**: Easy to add new features without restructuring
2. **Maintainability**: Clear separation of concerns
3. **Testability**: Each layer can be tested independently
4. **Team Collaboration**: Multiple developers can work on different features
5. **Type Safety**: Centralized types make refactoring easier
6. **Reusability**: Components and hooks can be shared across features

## Migration Path

As the app grows, you can:

- Split screens into smaller sub-components
- Extract feature-specific stores
- Add more specialized hooks
- Create feature modules (e.g., `src/features/growth/`)

This structure supports growth from MVP to production app.
