// src/modules/country/country.interface.ts
export interface ICountry {
  name: string;
  isoCode: string;
  continent: string;

  capital?: string;
  flagUrl?: string;
  currency?: string;
  languages?: string[];
  timeZones?: string[];
  population?: number;
  popularCities?: string[];
  callingCode?: string;
  travelAdvisory?: string;
  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}
