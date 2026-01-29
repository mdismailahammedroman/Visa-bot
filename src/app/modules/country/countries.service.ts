import axios from "axios";

export type CountryNowItem = {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
};

type CountriesNowResponse = {
  error: boolean;
  msg: string;
  data: CountryNowItem[];
};

const URL = "https://countriesnow.space/api/v0.1/countries";

let cache: { data: CountryNowItem[]; expiresAt: number } | null = null;
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const getCountriesCached = async (): Promise<CountryNowItem[]> => {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.data;

  const res = await axios.get<CountriesNowResponse>(URL, { timeout: 10_000 });

  if (res.data?.error || !Array.isArray(res.data?.data)) {
    throw new Error(res.data?.msg || "Failed to load countries");
  }

  cache = { data: res.data.data, expiresAt: now + TTL_MS };
  return cache.data;
};

export const findCountryByIso = async (code: string) => {
  const countries = await getCountriesCached();
  const q = code.trim().toUpperCase();

  // allow iso2 or iso3
  return countries.find(
    (c) => c.iso2.toUpperCase() === q || c.iso3.toUpperCase() === q,
  );
};

export const getCitiesByIso2 = async (iso2: string) => {
  const country = await findCountryByIso(iso2);
  return country?.cities ?? null;
};
