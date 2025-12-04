# Source Code Directory

This directory contains all application source code organized by feature and concern.

## Quick Navigation

- **`components/`** - Reusable UI components
- **`screens/`** - Full-screen components (pages)
- **`navigation/`** - Navigation configuration
- **`store/`** - Global state management (Zustand)
- **`hooks/`** - Custom React hooks
- **`services/`** - Business logic and data processing
- **`utils/`** - Pure utility functions
- **`types/`** - TypeScript type definitions
- **`data/`** - Static reference data (WHO growth charts)
- **`theme/`** - Design system (colors, typography, spacing)

## Import Paths

Use absolute imports with the `src/` prefix:

```typescript
import { Button } from 'src/components/common/Button';
import { useGrowthStore } from 'src/store/growthStore';
import { GrowthMeasurement } from 'src/types';
```

See `PROJECT_STRUCTURE.md` for detailed documentation.

