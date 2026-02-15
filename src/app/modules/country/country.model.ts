// src/modules/country/country.model.ts

import { Schema, model } from "mongoose";
import { ICountry } from "./country.interface";

const countrySchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    flag: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const CountryModel = model<ICountry>("Country", countrySchema);
