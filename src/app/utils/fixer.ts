import axios from "axios";
import axiosRetry from "axios-retry";
import { envVar } from "../config/EnvVar";
import { getCache, setCache } from "../config/redis.config";

axiosRetry(axios, { retries: 2 });

const FIXER_BASE_URL = "http://data.fixer.io/api";
const FIXER_API_KEY = envVar.FIXER_API_KEY;

export const getCurrencyRate = async (
  currencyCode: string,
): Promise<number | null> => {
  const key = `currency:rate:${currencyCode}`;

  const cached = await getCache<number>(key);
  if (cached) return cached;

  try {
    const response = await axios.get(`${FIXER_BASE_URL}/latest`, {
      timeout: 5000,
      params: {
        access_key: FIXER_API_KEY,
        symbols: currencyCode.toUpperCase(),
      },
    });

    const rate = response.data?.rates?.[currencyCode.toUpperCase()] ?? null;

    if (rate) await setCache(key, rate, 3600); // 1 hour TTL
    return rate;
  } catch (err) {
    console.error("Fixer API error:", err);
    return null;
  }
};
