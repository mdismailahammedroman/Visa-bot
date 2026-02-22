import { Schema, model } from "mongoose";
import { ICountry, validContinents, validCurrencies } from "./country.interface";

const countrySchema = new Schema<ICountry>(
  {
    countryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isoCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    continent: {
      type: String,
      required: true,
      enum: validContinents,
    },
    currencyRate: {
      type: Number,
      default: null,
    },
    capital: { type: String, trim: true },
    flagUrl: { type: String, trim: true },
    currency: {
      type: String,
      enum: validCurrencies,
    },
    timeZones: { type: [String], default: [] },
    population: { type: Number },
    popularCities: { type: [String], default: [] },
    callingCode: { type: String, trim: true },
    travelAdvisory: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

countrySchema.index(
  {
    countryName: "text",
    isoCode: "text",
    continent: "text",
  },
  {
    weights: {
      countryName: 5,
      isoCode: 4,
      continent: 2,
    },
  },
);

export const CountryModel = model<ICountry>("Country", countrySchema);
