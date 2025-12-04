# Quick Start Guide: Baby Growth Chart Tracker

## 📋 Summary

This document provides a quick overview of the technical requirements, library choices, and UX design for building a production-quality React Native baby growth tracker app.

---

## 🎯 Core Requirements (TL;DR)

### Must-Have Features
1. ✅ **Measurement Input** - Add/edit/delete with validation & unit conversion
2. ✅ **Data Persistence** - Local storage with AsyncStorage
3. ✅ **Growth Charts** - Weight-for-age percentiles (3, 10, 25, 50, 75, 90, 97)
4. ✅ **History View** - List all measurements with percentiles

### Technical Stack
- **Framework**: React Native CLI (TypeScript) ✅ Already set up
- **Charts**: Victory Native (recommended)
- **Storage**: AsyncStorage
- **State**: Zustand (lightweight, typed)
- **Forms**: React Hook Form + Zod
- **Dates**: Day.js
- **UI**: React Native Paper

---

## 📦 Essential Libraries to Install

```bash
# Core dependencies
npm install @react-native-async-storage/async-storage
npm install victory-native react-native-svg
npm install zustand
npm install dayjs
npm install react-hook-form zod @hookform/resolvers
npm install @react-native-community/datetimepicker
npm install react-native-paper react-native-vector-icons
npm install uuid

# Type definitions
npm install --save-dev @types/uuid
```

### Optional (for multi-screen navigation)
```bash
npm install @react-navigation/native @react-navigation/stack react-native-screens
```

---

## 🎨 UX Highlights

### Key Screens
1. **Home/Dashboard** - Chart as hero, quick stats, easy add button
2. **Add/Edit Form** - Smart defaults, real-time unit conversion, duplicate detection
3. **Chart View** - Interactive points, percentile toggle, insights
4. **History** - Chronological list, filter by metric, swipe actions

### Design Principles
- **Warm & Trustworthy** - Soft colors, friendly copy
- **Accessible** - Screen reader support, dynamic type, proper contrast
- **Performant** - < 500ms chart render, smooth interactions
- **Thoughtful** - Smart warnings, helpful insights, graceful errors

---

## 📊 Data Models

```typescript
interface GrowthMeasurement {
  id: string;                    // UUID
  date: string;                  // ISO date
  ageInDays: number;             // Calculated
  weightKg: number;              // SI units
  heightCm: number;              // SI units
  headCm: number;                // SI units
  weightPercentile?: number;     // 0-100
  heightPercentile?: number;
  headPercentile?: number;
}

interface BabyProfile {
  id: string;
  name: string;
  birthDate: string;             // ISO date
  gender: 'male' | 'female';
}
```

---

## 🔑 Critical Implementation Notes

### 1. WHO Growth Reference Data
- Download from WHO official sources
- Convert to compact JSON format
- Bundle locally (no network calls)
- Document source and processing method

### 2. Percentile Calculation
- **Option A**: LMS method (Z-score → percentile)
- **Option B**: Linear interpolation from precomputed tables
- Document your choice in README

### 3. Unit Conversion
- Store everything in SI units (kg, cm)
- Convert for display only
- Preserve precision (don't round until display)

### 4. Age Calculation
- Calculate `ageInDays` from `birthDate` to `measurement.date`
- Handle leap years correctly
- Unit test this function!

### 5. Storage Schema
```typescript
// Keys
'growth/v1/profile'        // BabyProfile
'growth/v1/measurements'   // GrowthMeasurement[]
'growth/v1/schemaVersion'  // number (for migrations)
```

---

## ✅ Acceptance Criteria Checklist

### Measurement Input
- [ ] Date picker (default today, allow historical)
- [ ] Weight, Height, Head inputs with unit selector
- [ ] Real-time unit conversion display
- [ ] Validation with friendly error messages
- [ ] Edit existing entries
- [ ] Delete with confirmation
- [ ] Duplicate detection/warning

### Data Persistence
- [ ] Save to AsyncStorage
- [ ] Namespaced keys (`growth/v1/...`)
- [ ] Schema versioning
- [ ] Graceful error handling
- [ ] Survives app restart

### Growth Charts
- [ ] Render weight-for-age percentiles (7 curves)
- [ ] Display baby data points
- [ ] Tap point → show details
- [ ] Proper axis labels with units
- [ ] Readable on small screens
- [ ] < 500ms initial render

### History View
- [ ] Chronological list (consistent order)
- [ ] Show converted units
- [ ] Display computed percentiles
- [ ] Edit/delete actions

---

## 🧪 Testing Requirements

### Unit Tests (Jest)
- [ ] Age calculation (including leap years)
- [ ] Unit conversion (kg↔lb, cm↔in)
- [ ] Percentile calculation
- [ ] Storage serialization/deserialization

### Manual Test Plan
- [ ] Normal measurements save correctly
- [ ] Imperial → SI conversion accurate
- [ ] Historical entries have correct ageInDays
- [ ] Single point displays correctly (no broken lines)
- [ ] Multiple points show trend
- [ ] Chart readable on small devices
- [ ] Kill & relaunch retains data
- [ ] Edit updates chart immediately
- [ ] Delete removes points
- [ ] Corrupted storage shows recovery dialog
- [ ] 60 entries: chart renders < 500ms

---

## 📝 Deliverables Checklist

### Code
- [ ] Clean file structure
- [ ] Sensible component organization
- [ ] package.json scripts: start, android, ios, test, lint, typecheck

### README.md
- [ ] Setup & run instructions
- [ ] Architecture overview
- [ ] Charting library justification
- [ ] WHO data source citation
- [ ] Known trade-offs
- [ ] Future improvements

### Demo Video
- [ ] 2-3 minute walkthrough
- [ ] Public link (Loom/Drive)
- [ ] Shows all core features

---

## 🚀 Next Steps

1. **Install dependencies** (see above)
2. **Set up project structure**:
   ```
   src/
     components/
     screens/
     hooks/
     store/
     utils/
     data/
     types/
   ```
3. **Create data models** (TypeScript interfaces)
4. **Set up Zustand store** (state management)
5. **Implement storage layer** (AsyncStorage wrapper)
6. **Build form component** (react-hook-form)
7. **Integrate chart library** (Victory Native)
8. **Add WHO reference data** (JSON file)
9. **Implement percentile calculation**
10. **Build UI screens** (following UX design)
11. **Add tests** (critical calculations)
12. **Polish & optimize** (performance, accessibility)

---

## 📚 Reference Documents

- **TECHNICAL_REQUIREMENTS.md** - Detailed technical specs
- **LIBRARY_RECOMMENDATIONS.md** - Complete library breakdown
- **UX_DESIGN.md** - Full UX design and interactions

---

## 💡 Pro Tips

1. **Start Simple** - Get basic chart working first, then add features
2. **Test Early** - Write tests for calculations as you build
3. **Performance** - Profile chart rendering early (50+ points)
4. **Accessibility** - Test with screen reader from the start
5. **Error Handling** - Plan for edge cases (empty state, corrupted data)
6. **Documentation** - Keep README updated as you build

---

**Good luck building! 🚀👶📊**

