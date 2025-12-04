# Library Recommendations for Baby Growth Chart Tracker

## Recommended Tech Stack

### Core Framework (Already Set)
- ✅ **React Native CLI** (0.82.1) - Already configured
- ✅ **TypeScript** (5.8.3) - Already configured

### Essential Libraries

#### 1. **Charts/Visualization** ⭐ CRITICAL
**Recommended: `victory-native`**
```bash
npm install victory-native react-native-svg
```

**Why Victory Native?**
- ✅ Most mature and feature-rich RN charting library
- ✅ Excellent performance with large datasets
- ✅ Built-in interpolation and curve smoothing
- ✅ Highly customizable (colors, labels, tooltips)
- ✅ Active maintenance and TypeScript support
- ✅ Works well with SVG for smooth percentile curves
- ✅ Supports interactive tooltips/tap events

**Alternative: `react-native-chart-kit`**
- Simpler API, but less flexible
- Good for basic charts
- May struggle with complex percentile curves

**Implementation Notes:**
- Use `VictoryLine` for percentile curves (7 lines)
- Use `VictoryScatter` for baby data points
- Use `VictoryTooltip` for tap interactions
- Customize `VictoryAxis` for proper labels

#### 2. **Storage**
```bash
npm install @react-native-async-storage/async-storage
```

**Why AsyncStorage?**
- ✅ Standard React Native storage solution
- ✅ Simple key-value API
- ✅ Handles JSON serialization
- ✅ Persistent across app restarts
- ✅ No additional native dependencies

**Storage Structure:**
```typescript
// Keys
'growth/v1/profile'        // BabyProfile
'growth/v1/measurements'   // GrowthMeasurement[]
'growth/v1/schemaVersion'  // number
```

#### 3. **State Management**
**Recommended: `zustand`**
```bash
npm install zustand
```

**Why Zustand?**
- ✅ Minimal boilerplate
- ✅ Excellent TypeScript support
- ✅ Built-in performance optimizations
- ✅ Simple API (no providers needed)
- ✅ Perfect for small-medium apps
- ✅ DevTools support

**Alternative: React Context + useReducer**
- Built-in, no dependencies
- More boilerplate
- Can cause unnecessary re-renders

**Store Structure:**
```typescript
interface GrowthStore {
  profile: BabyProfile | null;
  measurements: GrowthMeasurement[];
  displayUnits: { weight: 'kg' | 'lb', height: 'cm' | 'in' };
  // Actions
  setProfile: (profile: BabyProfile) => void;
  addMeasurement: (measurement: GrowthMeasurement) => void;
  updateMeasurement: (id: string, data: Partial<GrowthMeasurement>) => void;
  deleteMeasurement: (id: string) => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}
```

#### 4. **Date/Time Handling**
**Recommended: `dayjs`**
```bash
npm install dayjs
```

**Why dayjs?**
- ✅ Tiny bundle size (~2KB)
- ✅ Immutable API
- ✅ Plugin system
- ✅ Excellent TypeScript support
- ✅ Similar API to moment.js (easier migration)

**Required Plugins:**
```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(duration);
```

**Alternative: `date-fns`**
- More functional approach
- Tree-shakeable
- Slightly larger bundle

#### 5. **Form Handling**
**Recommended: `react-hook-form`**
```bash
npm install react-hook-form
```

**Why react-hook-form?**
- ✅ Minimal re-renders (performance)
- ✅ Excellent validation library integration
- ✅ TypeScript-first
- ✅ Small bundle size
- ✅ Great error handling

**Validation: `zod`** (recommended with react-hook-form)
```bash
npm install zod @hookform/resolvers
```

**Why zod?**
- ✅ TypeScript-first schema validation
- ✅ Runtime type checking
- ✅ Great error messages
- ✅ Composable schemas

**Form Schema Example:**
```typescript
import { z } from 'zod';

const measurementSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  weight: z.number().min(0.1).max(50),
  height: z.number().min(20).max(200),
  head: z.number().min(20).max(80),
  unit: z.enum(['metric', 'imperial']),
});
```

#### 6. **Date Picker**
**Recommended: `@react-native-community/datetimepicker`**
```bash
npm install @react-native-community/datetimepicker
```

**Why?**
- ✅ Native iOS/Android pickers
- ✅ Official React Native Community package
- ✅ Consistent UX across platforms
- ✅ Handles timezone correctly

#### 7. **Navigation** (if multi-screen)
**Recommended: `@react-navigation/native`**
```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

**Why?**
- ✅ Industry standard
- ✅ Excellent TypeScript support
- ✅ Smooth animations
- ✅ Deep linking support

**Note:** If single-screen with tabs/modals, consider `@react-navigation/bottom-tabs` or `@react-navigation/modal`

#### 8. **UI Components & Icons**
**Recommended: `react-native-paper`**
```bash
npm install react-native-paper react-native-vector-icons
```

**Why react-native-paper?**
- ✅ Material Design components
- ✅ Consistent, polished UI
- ✅ Built-in theming
- ✅ Accessibility support
- ✅ TypeScript support

**Icons:**
```bash
npm install react-native-vector-icons
# or if using Expo
npm install @expo/vector-icons
```

#### 9. **UUID Generation**
**Recommended: `uuid`**
```bash
npm install uuid
npm install --save-dev @types/uuid
```

**Why?**
- ✅ Standard UUID v4 generation
- ✅ Durable IDs for measurements
- ✅ No collisions

#### 10. **Testing Utilities**
**Already included:**
- ✅ Jest
- ✅ React Test Renderer

**Additional (optional):**
```bash
npm install --save-dev @testing-library/react-native
```

## WHO Growth Reference Data

### Source Options:
1. **WHO Anthro Survey Analyser** (official)
   - URL: https://www.who.int/tools/child-growth-standards/software
   - Provides LMS parameters
   - Requires conversion to JSON

2. **CDC Growth Charts**
   - URL: https://www.cdc.gov/growthcharts/
   - Precomputed percentiles
   - May be easier to use

3. **Pre-processed JSON** (recommended)
   - Download WHO LMS tables
   - Convert to compact JSON format
   - Store in `src/data/growthReferences.json`

### Data Structure:
```typescript
interface GrowthReference {
  sex: 'male' | 'female';
  metric: 'weight' | 'height' | 'head';
  data: {
    ageDays: number;
    L: number;  // Lambda (skewness)
    M: number;  // Median
    S: number;  // Coefficient of variation
  }[];
}
```

## Complete Package.json Dependencies

```json
{
  "dependencies": {
    "react": "19.1.1",
    "react-native": "0.82.1",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "victory-native": "^36.9.2",
    "react-native-svg": "^14.1.0",
    "zustand": "^4.4.7",
    "dayjs": "^1.11.10",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "@react-native-community/datetimepicker": "^7.6.2",
    "react-native-paper": "^5.11.3",
    "react-native-vector-icons": "^10.0.3",
    "uuid": "^9.0.1",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^5.5.2"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.7",
    "@testing-library/react-native": "^12.4.3"
  }
}
```

## Installation Order

1. Install core dependencies:
```bash
npm install @react-native-async-storage/async-storage victory-native react-native-svg zustand dayjs react-hook-form zod @hookform/resolvers uuid
```

2. Install UI dependencies:
```bash
npm install @react-native-community/datetimepicker react-native-paper react-native-vector-icons
```

3. Install navigation (if needed):
```bash
npm install @react-navigation/native @react-navigation/stack react-native-screens
```

4. Link native dependencies (if not auto-linked):
```bash
cd ios && pod install && cd ..
```

5. For Android vector icons, add to `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

## Performance Considerations

1. **Chart Rendering:**
   - Use `React.memo` for chart components
   - Debounce chart updates during rapid data changes
   - Lazy load chart library if possible

2. **Storage:**
   - Batch writes (don't save on every keystroke)
   - Use debounced auto-save
   - Consider pagination for history view

3. **State Management:**
   - Zustand selectors prevent unnecessary re-renders
   - Memoize expensive calculations (percentiles)

4. **Form Performance:**
   - react-hook-form minimizes re-renders by default
   - Use `Controller` component for controlled inputs

