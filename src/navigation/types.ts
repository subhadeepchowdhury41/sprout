/**
 * Navigation type definitions
 */

export type RootStackParamList = {
  Home: undefined;
  AddMeasurement: { measurementId?: string } | undefined;
  Chart: { metric: 'weight' | 'height' | 'head' };
  History: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

