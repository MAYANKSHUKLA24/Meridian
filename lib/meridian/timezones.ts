export type CityOption = {
  label: string;
  /** IANA timezone id, or null for the visitor's own local time. */
  timeZone: string | null;
};

export const CITY_OPTIONS: CityOption[] = [
  { label: "My Time", timeZone: null },
  { label: "New York", timeZone: "America/New_York" },
  { label: "London", timeZone: "Europe/London" },
  { label: "Mumbai", timeZone: "Asia/Kolkata" },
  { label: "Dubai", timeZone: "Asia/Dubai" },
  { label: "Tokyo", timeZone: "Asia/Tokyo" },
  { label: "Sydney", timeZone: "Australia/Sydney" },
  { label: "Los Angeles", timeZone: "America/Los_Angeles" },
];
