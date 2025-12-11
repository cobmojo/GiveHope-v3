import { loadStripe } from "@stripe/stripe-js";

// In a real app, this would be process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// We use a test key here for the mock environment
export const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");