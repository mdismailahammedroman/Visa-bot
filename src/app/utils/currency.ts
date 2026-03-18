import { getCurrencyRate } from "./fixer";

// 🔥 convert USD → user currency
export const convertAmount = (
  amount: number,
  rate: number,
  currency: string
) => {
  if (!amount) return 0;
  if (currency === "USD") return amount;

  return amount * rate;
};

// 🔥 convert user currency → USD (save time)
export const convertToUSD = async (
  amount: number,
  fromCurrency: string
) => {
  if (!amount) return 0;
  if (fromCurrency === "USD") return amount;

  const rate = await getCurrencyRate(fromCurrency);
  if (!rate) return amount;

  return amount / rate;
};