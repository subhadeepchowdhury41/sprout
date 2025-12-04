# Growth Reference Data

This directory contains WHO growth reference data files.

## Data Sources

### WHO Growth Standards
- **Source**: World Health Organization Child Growth Standards
- **URL**: https://www.who.int/tools/child-growth-standards
- **Format**: LMS parameters (Lambda, Median, Sigma)
- **Age Range**: 0-24 months
- **Sex**: Separate files for male and female

### File Structure

- `whoWeightMale.json` - Weight-for-age LMS data (male)
- `whoWeightFemale.json` - Weight-for-age LMS data (female)
- `whoHeightMale.json` - Length/height-for-age LMS data (male)
- `whoHeightFemale.json` - Length/height-for-age LMS data (female)
- `whoHeadMale.json` - Head circumference-for-age LMS data (male)
- `whoHeadFemale.json` - Head circumference-for-age LMS data (female)

## Data Format

Each JSON file should follow this structure:

```json
{
  "sex": "male" | "female",
  "metric": "weight" | "height" | "head",
  "data": [
    {
      "ageDays": 0,
      "L": 0.3487,
      "M": 3.346,
      "S": 0.14602
    },
    ...
  ]
}
```

## Processing Steps

1. Download LMS tables from WHO website
2. Convert to JSON format
3. Validate data structure
4. Store in this directory
5. Document exact source URLs and dates

## Usage

Import and use in percentile calculation service:

```typescript
import weightMaleData from './whoWeightMale.json';
```

