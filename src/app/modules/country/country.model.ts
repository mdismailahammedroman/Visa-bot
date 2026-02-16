// src/modules/country/country.model.ts
import { Schema, model } from "mongoose";
import { ICountry } from "./country.interface";

const countrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isoCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    continent: { type: String, required: true, trim: true },

    capital: { type: String, trim: true },
    flagUrl: { type: String, trim: true },
    currency: { type: String, trim: true },

    timeZones: { type: [String], default: [] },
    population: { type: Number },

    popularCities: { type: [String], default: [] },
    callingCode: { type: String, trim: true },

    travelAdvisory: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

// search support
countrySchema.index({ name: "text", isoCode: "text", continent: "text" });

export const CountryModel = model<ICountry>("Country", countrySchema);
