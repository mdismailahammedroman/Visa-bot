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
  "AUD",
  "CHF",
  "NZD",
  "JPY",
  "CNY",
  "SAR",
  "AED",
  "TRY",
  "MYR",
  "IRR",
  "KWD",
  "BHD",
  "OMR",
  "QAR",
] as const;

export type Currency = (typeof validCurrencies)[number];

export interface ICountry {
  countryName: string;
  isoCode: string;
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
