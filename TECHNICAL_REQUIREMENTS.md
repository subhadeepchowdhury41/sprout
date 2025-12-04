# Technical Requirements Extraction

## Core Framework & Setup
- **Framework**: React Native (TypeScript) - CLI or Expo
- **Language**: TypeScript (strict typing required)
- **Build System**: React Native CLI (already configured)

## Required Libraries & Dependencies

### 1. **Charts/Visualization**
- **Primary Choice**: `react-native-chart-kit` or `victory-native`
- **Alternative**: `react-native-svg-charts`
- **Requirement**: Must render percentile curves (3, 10, 25, 50, 75, 90, 97) + baby data points
- **Features Needed**: 
  - Interactive data points (tap to show details)
  - Axis labels with units
  - Responsive for small screens
  - Performance: < 500ms initial render with 50+ measurements

### 2. **Storage**
- **Primary**: `@react-native-async-storage/async-storage`
- **Bonus**: Expo Secure Store (if using Expo)
- **Requirements**:
  - Namespaced keys (`growth/v1/measurements`)
  - Graceful JSON parsing error handling
  - Schema versioning for migrations
  - Durable IDs

### 3. **State Management**
- **Options**: React Context, Zustand, Redux Toolkit, or simple React state
- **Requirement**: Keep it simple, typed, and performant
- **Recommendation**: Zustand (lightweight, typed, performant)

### 4. **Date/Time Handling**
- **Required**: `dayjs` or `date-fns` (avoid moment.js)
- **Features**:
  - Age calculation (birthDate → measurement date)
  - Handle leap years
  - Explicit timezone handling
  - ISO date string storage

### 5. **Form Handling**
- **Primary**: `react-hook-form`
- **Alternative**: Custom form with validation
- **Requirements**:
  - Robust validation with friendly error messages
  - Unit conversion (kg/lb, cm/in)
  - Date picker (default today, allow historical)
  - Real-time or submit-time conversion

### 6. **Testing & Quality**
- **Testing**: Jest (already configured)
- **Linting**: ESLint + Prettier (already configured)
- **Type Checking**: TypeScript
- **Test Coverage**: Critical calculations (age, percentiles, conversions)

### 7. **UI/UX Libraries**
- **Navigation**: `@react-navigation/native` + `@react-navigation/stack` (if multi-screen)
- **Date Picker**: `@react-native-community/datetimepicker`
- **Icons**: `react-native-vector-icons` or `@expo/vector-icons`
- **UI Components**: Consider `react-native-paper` or `react-native-elements` for polished UI

## Data Models

### GrowthMeasurement Interface
```typescript
export interface GrowthMeasurement {
  id: string;                    // Durable ID (UUID)
  date: string;                  // ISO date string (UTC 00:00)
  ageInDays: number;             // Derived from birthDate → date
  weightKg: number;               // Stored in SI units
  heightCm: number;               // Stored in SI units
  headCm: number;                 // Stored in SI units
  weightPercentile?: number;     // 0–100
  heightPercentile?: number;      // 0–100
  headPercentile?: number;        // 0–100
}
```

### BabyProfile Interface
```typescript
export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string;              // ISO date string
  gender: 'male' | 'female';
}
```

## Core Features & Acceptance Criteria

### 1. Measurement Input Form
- **Fields**: Date, Weight, Height/Length, Head circumference, Unit selector
- **Validation**: Friendly error messages
- **Unit Conversion**: Real-time or on submit (preserve precision)
- **Edit/Delete**: Edit existing entries, delete with confirmation
- **Duplication**: Document choice (one per day vs multiple with warnings)

### 2. Data Persistence
- **Storage Key**: `growth/v1/measurements`
- **Schema Version**: Include version for migrations
- **Error Handling**: Graceful JSON parsing error recovery

### 3. Growth Chart Visualization
- **Minimum**: Weight-for-age percentile curves
- **Percentiles**: 3, 10, 25, 50, 75, 90, 97
- **Interpolation**: LMS method (Z-score → percentile) OR linear interpolation
- **Interactivity**: Tap data point → show date, age, value, percentile
- **Accessibility**: Readable labels, proper units

### 4. History View
- **Order**: Chronological (newest/oldest first - be consistent)
- **Display**: Converted units + computed percentiles
- **Actions**: Edit, delete entries

## Reference Data Requirements

### WHO Growth References
- **Source**: Public WHO growth reference tables
- **Format**: Convert to compact JSON (bundled locally)
- **Method**: LMS parameters OR precomputed percentiles
- **Documentation**: Cite exact sources and processing steps
- **Age Range**: 0–24 months
- **By Sex**: Separate data for male/female

### Age Calculation
- **Helper**: Custom age-in-days function OR date library
- **Unit Tests**: Required for age calculation
- **Leap Years**: Must handle correctly

## Non-Functional Requirements

### Performance
- **Measurements**: Handle 50+ without jank
- **Chart Render**: < 500ms initial render on mid-range device
- **Optimization**: Memoization where appropriate
- **Re-renders**: Minimize unnecessary re-renders

### Resilience
- **Empty State**: Handle gracefully
- **Single Point**: Display correctly
- **Dense Data**: Handle many measurements
- **Corrupted Storage**: Show recovery dialog (reset option)

## Deliverables Checklist

### Code
- [ ] Clean file structure
- [ ] Sensible components/hooks organization
- [ ] package.json scripts: start, android, ios, test, lint, typecheck

### README.md
- [ ] Setup & run instructions
- [ ] Architecture overview
- [ ] Charting library justification
- [ ] Known trade-offs
- [ ] Future improvements

### Demo Video
- [ ] 2–3 minute public link (Loom/Drive)

## Test Plan (Verification)

### Data Input
- [ ] Normal measurements save correctly
- [ ] Age computed correctly
- [ ] Imperial → SI conversion correct
- [ ] Historical entries have correct ageInDays

### Charts
- [ ] Single point displays as dot (no broken lines)
- [ ] Multiple points show trend
- [ ] Correct axes/labels
- [ ] Small devices readable (no clipped labels)

### Persistence
- [ ] Kill & relaunch retains data
- [ ] Edit updates chart immediately
- [ ] Delete removes points
- [ ] Corrupted storage shows recovery dialog

### Performance
- [ ] 60 entries: first chart paint < 500ms
- [ ] Interactions remain responsive

