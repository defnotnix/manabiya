export type PropPreferenceWrapper = {
  testMode?: boolean;
  defaults?: any;
  appKey: string;
  userId: string;
  fetchPreferenceFn?: () => Promise<string>;
  version?: string;
  onVersionMismatch?: (preference: any) => Promise<any>;
};
