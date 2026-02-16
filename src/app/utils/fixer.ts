import { envVar } from "./../config/EnvVar";
import axios from "axios";

const FIXER_BASE_URL = "http://data.fixer.io/api";
const FIXER_API_KEY = envVar.FIXER_API_KEY;

export const getCurrencyRate = async (
  currencyCode: string,
): Promise<number | null> => {
  try {
    const response = await axios.get(`${FIXER_BASE_URL}/latest`, {
      params: {
        access_key: FIXER_API_KEY,
        symbols: currencyCode.toUpperCase(),
      },
    });

    const data = response.data;
    if (!data.success) return null;

    const rate = data.rates?.[currencyCode.toUpperCase()];
    if (!rate) return null;

    return rate;
  } catch (err) {
    console.error("Fixer API error:", err);
    return null;
  }
};
