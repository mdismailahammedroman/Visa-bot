// src/modules/country/country.interface.ts
export const validContinents = [
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Europe",
  "Oceania",
  "Antarctica",
] as const;

export type Continent = (typeof validContinents)[number];

export const validCurrencies = [
  "USD",
  "CAD",
  "EUR",
  "BDT",
  "GBP",
  "JPY",
  "CNY",
] as const;

export type Currency = (typeof validCurrencies)[number];

export interface ICountry {
  countryName: string; // name of the country
  isoCode: string; // 2-3 uppercase letters
  continent: Continent;

  capital?: string;
  flagUrl?: string;
  currency?: Currency;
  currencyRate?: number | null;

  timeZones?: string[];
  population?: number;
  popularCities?: string[];
  callingCode?: string;
  travelAdvisory?: string;
  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}
