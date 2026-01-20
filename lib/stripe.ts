import Stripe from "stripe";

const apiVersion: Stripe.StripeConfig["apiVersion"] = "2024-09-30";

let stripe: Stripe | null = null;

export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion });
  }
  return stripe;
};

export const PRICE_LOOKUP = {
  launch: process.env.STRIPE_PRICE_LAUNCH,
  scale: process.env.STRIPE_PRICE_SCALE,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
};

