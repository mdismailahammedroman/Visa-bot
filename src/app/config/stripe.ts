import dotenv from "dotenv";
import Stripe from "stripe";
import { envVar } from "./EnvVar";
dotenv.config();

export const stripe = new Stripe(envVar.STRIPE.STRIPE_SECRET_KEY as string);
